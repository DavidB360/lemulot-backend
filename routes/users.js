var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

// signup route
router.post('/signup', (req, res) => {
  // use module checkbody to detect empty fields
  if (!checkBody(req.body, ['email', 'password', 'lastName', 'firstName', 'zipCode', 'city', 'phoneNumber'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  // Check if the user has not already been registered (search for email and phone number in data base)
  User.findOne({ $or: [{email: req.body.email }, {phoneNumber: req.body.phoneNumber}] }).then(data => {
    if (data === null) {
      // hash password
      const hash = bcrypt.hashSync(req.body.password, 10);
      // create new user
      const newUser = new User({
        email: req.body.email,
        password: hash,
        lastName: req.body.lastName,
        firstName: req.body.firstName,
        zipcode: req.body.zipcode,
        city: req.body.city,
        phoneNumber: req.body.phoneNumber,
        // generate token
        token: uid2(32),
        avatar: null,
        canLike: true,
        favoriteLessons: [],
        helpRequests: []
      });
      newUser.save().then(newDoc => {
        // return result true and token when new user saved in data base
        res.json({ result: true, token: newDoc.token });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: 'User already exists as email or phone number is already registered in data base' });
    }
  });
});

// signin route
router.post('/signin', (req, res) => {
  // use module checkbody to detect empty fields
  if (!checkBody(req.body, ['email', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  // allow connection with both email or phone number
  User.findOne({$or: [{ email: req.body.email }, { phoneNumber: req.body.email }]}).then(data => {
    // check password
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token });
    } else {
      res.json({ result: false, error: 'User not found or wrong password' });
    }
  });
});

// canLike route
router.get('/canLike/:token', (req, res) => {
  User.findOne({ token: req.params.token }).then(data => {
    if (data) {
      res.json({ result: true, canLike: data.canLike });
    } else {
      res.json({ result: false, error: 'User not found' });
    }
  });
});

// addToFavorites route

// removeFromFavorites route

// addToHelpRequests route

// addMessage

// editHelpRequestStatus

module.exports = router;