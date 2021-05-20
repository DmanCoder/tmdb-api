const axios = require('axios');
const express = require('express');
const url = require('url');

const router = express.Router();

// Validators
const validateTrailerTv = require('../../../validations/trailer/tv');

/**
 * @dec       This API makes a request to TMDb API and returns the request
 *            for the client to consume
 * @route     GET /api/tv/on_the_air
 * @param     {req, res} - Request & Response
 * @returns   {boolean}
 * @access    Public
 */
router.get('/', (req, res) => {
  // Expected params
  const queryObject = url.parse(req.url, true).query;
  const { language, page } = queryObject;

  // API access key
  const { TMDb_API } = process.env;

  // Reject if expected params are not present
  const { errors, isValid } = validateTrailerTv(queryObject);
  if (!isValid) {
    res.status(400);
    return res.send({ errors });
  }

  // Get popular movies
  axios
    .get(
      `https://api.themoviedb.org/3/tv/on_the_air?api_key=${TMDb_API}&language=${language}&page=${page}`
    )
    .then((response) => {
      const { data } = response;

      // Sore by `vote_average`
      let results = data.results.sort(
        (a, b) => parseFloat(b.vote_average) - parseFloat(a.vote_average)
      );

      // Only the first 12 is sent through
      results = results.slice(0, 12);

      // Stores multiple requests
      const multiReq = [];
      results.map((tv) => {
        multiReq.push(
          axios.get(
            `https://api.themoviedb.org/3/tv/${tv.id}/videos?api_key=${TMDb_API}&language=${language}`
          )
        );
      });

      // Make request to all
      axios
        .all(multiReq)
        .then(
          axios.spread((...allRes) => {
            // Add `trailers` to the results object
            allRes.map((vid, index) => {
              results[index].trailers = vid.data;
            });

            res.send({ ...data, results });
          })
        )
        .catch((err) => {
          const { data } = errors.response;
          res.send({ errors: { ...data, message: 'Issues Fetching results' } });
        });
    })
    .catch((errors) => {
      const { data } = errors.response;
      res.send({ errors: { ...data, message: 'Issues Fetching results' } });
    });
});

module.exports = router;
