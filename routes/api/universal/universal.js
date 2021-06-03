const axios = require('axios');
const express = require('express');
const url = require('url');
const isEmpty = require('../../../utils/isEmpty');

const router = express.Router();

// Validators
const validateUniversal = require('../../../validations/universal/universal');

/**
 * @dec       This API makes a request to TMDb API and returns the request
 *            for the client to consume
 * @route     GET /api/tv/details || `today`/ TODO: Add option to do `week` || `today`
 * @param     {any} value - string, object, array, number, anything
 * @returns   {boolean}
 * @access    Public
 */
router.get('/', (req, res) => {
  // Expected params
  const queryObject = url.parse(req.url, true).query;
  const { media_type, id, language, page } = queryObject;

  // API access key
  const { TMDb_API } = process.env;

  // Reject if expected params are not present
  const { errors, isValid } = validateUniversal(queryObject);
  if (!isValid) {
    res.status(400);
    return res.send({ errors });
  }

  const baseURL = 'https://api.themoviedb.org/3';

  const details = axios.get(
    `${baseURL}/${media_type}/${id}?api_key=${TMDb_API}&language=${language}&page=${page}`
  );

  console.log(media_type);
  let contentRating;
  if (media_type === 'movie') {
    contentRating = axios.get(
      `${baseURL}/${media_type}/${id}?api_key=${TMDb_API}&append_to_response=releases&language=en-US`
    );
  } else if (media_type === 'tv') {
    contentRating = axios.get(
      `${baseURL}/${media_type}/${id}/content_ratings?api_key=${TMDb_API}&language=en-US`
    );
  }

  axios
    .all([details, contentRating])
    .then(
      axios.spread((...responses) => {
        const detailsRes = responses[0];
        const contentRatingRes = responses[1];

        let rating;
        if (media_type === 'tv') {
          rating = contentRatingRes.data.results.find(
            (item) => item.iso_3166_1.toLowerCase() === 'us'
          );

          if (isEmpty(rating)) rating = contentRatingRes.data.results[0];

          rating = {
            certificate: rating.rating,
            iso_3166_1: rating.iso_3166_1,
          };
        } else if (media_type === 'movie') {
          rating = contentRatingRes.data.releases.countries.find(
            (item) =>
              (item.iso_3166_1.toLowerCase() === 'us') &
              !isEmpty(item.certification)
          );

          if (isEmpty(rating)) rating = contentRatingRes.data.releases.countries[0];

          rating = {
            certificate: rating.certification,
            iso_3166_1: rating.iso_3166_1,
          };
        } else {
          rating = {};
        }

        res.send({
          ...detailsRes.data,
          content_rating: rating,
        });
      })
    )
    .catch((errors) => {
      const { data } = errors.response;
      res.send({ errors: { ...data, message: 'Issues Fetching results' } });
    });
});

module.exports = router;
