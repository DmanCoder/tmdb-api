const querystring = require('querystring');
const url = require('url');
const express = require('express');

const router = express.Router();

// @route    GET /revers-word
// @dec      This API should return the sum of the supplied integers
//           Your API should return a 200 (OK) response and the sum should be in the body of the response.
// @access   Public
router.get('/', (req, res) => {
  const originalUrl = req.originalUrl;
  const rawURL = `https://babbfc45f753.ngrok.io${originalUrl}`;

  const parsedUrl = url.parse(rawURL);
  const parsedQs = querystring.parse(parsedUrl.query);

  const reversedString = reverseString(parsedQs.sentence);

  res.status(200);
  res.json(reversedString);
});

// @dec     Helper function - helps reverses a string without affecting the position of punctuations.
function reverseString(string) {
  return string.replace(/[a-z]+/gi, function (word) {
    return word.split('').reverse().join('');
  });
}

module.exports = router;
