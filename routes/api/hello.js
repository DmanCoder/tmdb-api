const express = require('express');
const router = express.Router();

// @route    GET api/hello
// @dec      This API is to test that your website is up and running.
//           Returns a 204 (NoContent) response with an empty body.
// @access   Public

router.get('/', (req, res) => {
    res.send('TESTING 234')
});

module.exports = router;
