var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');


router.post('/signup', async (req, res) => {
  if (!checkBody(req.body, ['username', 'firstname', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  // Check if the user has not already been registered
  try {
    const data = await User.findOne({ username: req.body.username });
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        username: req.body.username,
        firstname: req.body.firstname,
        password: hash,
        token: uid2(32),
      });

      const saveUser = await newUser.save();
      res.json({ result: true, firstname: saveUser.firstname, username: saveUser.username, token: saveUser.token });
    } else {
      // User already exists in database
      res.json({ result: false, error: 'User already exists' });
    }
  } catch (error) {
    res.json({ result: false, error });
  }
});

router.post('/signin', async (req, res) => {
  if (!checkBody(req.body, ['username', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  try {
    const data = await User.findOne({ username: req.body.username });

    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      if (data.token === '') {
        data.token = uid2(32);
        await User.updateOne({ username: req.body.username }, { token: data.token });
      }
      res.json({ result: true, firstname: data.firstname, username: data.username,  token: data.token });
    } else {
      res.json({ result: false, error: 'User not found or wrong password' });
    }
  } catch (error) {
    res.json({ result: false, error });
  }
});


router.post('/logout', async (req, res) => {
  if (!checkBody(req.body, ['token'])) {
    res.json({ result: false, error: 'Missing field' });
    return;
  }

  const data = await User.updateOne({ token: req.body.token }, { token: '' });
  try {
    if (data.modifiedCount === 1) {
      res.json({ result: true });
    } else {
      res.json({ result: false, error: 'Wrong token' });
    }
  } catch (error) {
    res.json({ result: false, error });
  }
});

module.exports = router;
