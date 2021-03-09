const querystring = require('querystring');
const url = require('url');
const express = require('express');

const router = express.Router();

// @route    GET /sum
// @dec      This API should return the sum of the supplied integers
//           Your API should return a 200 (OK) response and the sum should be in the body of the response.
// @access   Public

router.get('/', (req, res) => {
  const originalUrl = req.originalUrl;
  const rawURL = `https://babbfc45f753.ngrok.io${originalUrl}`;

  const parsedUrl = url.parse(rawURL);
  const parsedQs = querystring.parse(parsedUrl.query);

  // Removes everything from the string except numbers e.g 123,46,32 -> [ '1', '5', '2', '5' ]
  const arrayOfNumbers = parsedQs.number.match(/\d+/g);

  // Gets sum of number
  const result = arrayOfNumbers.reduce((a, b) => +a + +b);

  res.status(200);
  res.json(result);
});

module.exports = router;
