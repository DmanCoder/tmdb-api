const axios = require('axios');
const express = require('express');
const router = express.Router();

const isEmpty = require('../../../utils/isEmpty');

/**
 * @dec       This API makes a request to TMDb API and returns the request
 *            for the client to consume
 * @route     GET /api/popular/tv
 * @param     {any} value - string, object, array, number, anything
 * @returns   {boolean}
 * @access    Public
 */
router.get('/', (req, res) => {
  // Expected headers
  const { language } = req.headers;

  // API access key
  const { TMDb_API } = process.env;

  // Reject if language is not selected
  if (isEmpty(language)) {
    res.status(400);
    return res.send({
      data: { errors: { message: 'Please provide language' } },
    });
  }

  // Get popular movies
  axios
    .get(
      `https://api.themoviedb.org/3/tv/popular?api_key=${TMDb_API}&language=${language}&page=1`
    )
    .then((response) => {
      const { data } = response;

      res.send({ data });
    })
    .catch((errors) => {
      const { data } = errors.response;

      res.send({ data: { ...data, message: 'Issues Fetching results' } });
    });
});

module.exports = router;
