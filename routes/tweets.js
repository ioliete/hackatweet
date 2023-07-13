var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/users');
const Tweet = require('../models/tweets');
const { checkBody } = require('../modules/checkBody');

router.post("/addtweet", async (req, res) => {
  if (!checkBody(req.body, ['token', 'tweet'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  const data = await User.findOne({ token: req.body.token });
  if (data) {
    let newTweet = new Tweet({
      tweet: req.body.tweet,
      date: Date.now(),
      user: data._id,
    });
    await newTweet.save();
    res.json({ result: true });
  } else {
    res.json({ result: false, error: "Unidentified user" });
  }
});



module.exports = router;
