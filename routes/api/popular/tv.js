const axios = require('../../../api/init');
const express = require('express');
const url = require('url');

const router = express.Router();

// Utilities
const isEmpty = require('../../../utils/isEmpty');

// Validators
const validatePopularTv = require('../../../validations/popular/tv');

/**
 * @dec       This API makes a request to TMDb API and returns the request
 *            for the client to consume
 * @route     GET /api/popular/tv
 * @param     {any} value - string, object, array, number, anything
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
  const { errors, isValid } = validatePopularTv(queryObject);
  if (!isValid) {
    res.status(400);
    return res.send({
      data: { errors },
    });
  }

  // Get popular movies
  axios
    .get(`/tv/popular?api_key=${TMDb_API}&language=${language}&page=${page}`)
    .then((response) => {
      const { data } = response;

      res.send({ data });
    })
    .catch((errors) => {
      const { data } = errors.response;

      res.send({
        data: { errors: { ...data, message: 'Issues Fetching results' } },
      });
    });
});

module.exports = router;
