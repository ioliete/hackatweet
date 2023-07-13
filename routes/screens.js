var express = require('express');
var router = express.Router();

require('../models/connection');
const Tweet = require('../models/tweets');
const { checkBody } = require('../modules/checkBody');


router.get('/alltweets', async (req, res) => {
  if (!checkBody(req.params, ['token'])) {
    res.json({ result: false, error: 'User not found' });
    return;
  }

  try {
    const data = await Tweet.find().sort({ date: -1 });
    await data.populate('user');

    if (data.length > 0) {
      const tweets = data.map(tweet => ({
        id: tweet._id,
        username: tweet.user.username,
        user: tweet.user.firstname,
        date: tweet.date,
        message: tweet.tweet,
      }));
      res.json({ result: true, tweets });
    } else {
      res.json({ result: false, error: 'No tweets' });
    }
  } catch (error) {
    res.json({ result: false, error });
  }
});

module.exports = router;
