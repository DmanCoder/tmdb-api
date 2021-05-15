const express = require('express');
const router = express.Router();

// @route    GET /hello
// @dec      This API is to test that your website is up and running.
//           Returns a 204 (NoContent) response with an empty body.
// @access   Public

router.get('/', (req, res) => {
  console.log('testing', process.env.TMDb_API);
  res.json({ test: 'testing', key: process.env.TMDb_API, king: 'me' });
});

module.exports = router;
