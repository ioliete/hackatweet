var express = require('express');
var router = express.Router();

require('../models/connection');
const Tweet = require('../models/tweets');
const { checkBody } = require('../modules/checkBody');

router.post('/tweets', (req, res) => {
    Tweet.push(req.body.newTweet);
    res.json({ tweets: Tweet });
});

module.exports = router;
