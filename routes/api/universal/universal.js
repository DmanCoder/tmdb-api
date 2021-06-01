const axios = require('../../../api/init');
const express = require('express');
const url = require('url');

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

  // Get popular movies
  axios
    .get(
      `/${media_type}/${id}?api_key=${TMDb_API}&language=${language}&page=${page}`
    )
    .then((response) => {
      const { data } = response;
      res.send(data);
    })
    .catch((errors) => {
      const { data } = errors.response;
      res.send({ errors: { ...data, message: 'Issues Fetching results' } });
    });
});

module.exports = router;