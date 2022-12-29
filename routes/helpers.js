var express = require('express');
var router = express.Router();

require('../models/connection');
const Helper = require('../models/helpers');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

// signup route
router.post('/signup', (req, res) => {
  // use module checkbody to detect empty fields
  if (!checkBody(req.body, ['email', 'password', 'lastName', 'firstName', 'zipCode', 'city', 'phoneNumber'])) {
    res.json({ result: false, error: 'Champs vides ou manquants' });
    return;
  }
  // Check if the helper has not already been registered (search for email and phone number in data base)
  Helper.findOne({ $or: [{email: req.body.email }, {phoneNumber: req.body.phoneNumber}] }).then(data => {
    if (data === null) {
      // hash password
      const hash = bcrypt.hashSync(req.body.password, 10);
      // create new user
      const newHelper = new Helper({
        email: req.body.email,
        password: hash,
        lastName: req.body.lastName,
        firstName: req.body.firstName,
        zipCode: req.body.zipCode,
        city: req.body.city,
        phoneNumber: req.body.phoneNumber,
        // generate token
        token: uid2(32),
        avatar: null,
        trackedHelpRequests: []
      });
      newHelper.save().then(newHelper => {
        // return result true and helper informations (token, name) when new helper saved in data base
        res.json({ result: true, token: newHelper.token, firstName: newHelper.firstName, lastName: newHelper.lastName });
      });
    } else {
      // Helper already exists in database
      res.json({ result: false, error: 'L\'email ou le numéro de téléphone est déjà enregistré dans la base de données.' });
    }
  });
});

// signin route
router.post('/signin', (req, res) => {
  // use module checkbody to detect empty fields
  if (!checkBody(req.body, ['email', 'password'])) {
    res.json({ result: false, error: 'Formulaire incomplet, merci de renseigner toutes les informations requises' });
    return;
  }
  // allow connection with both email or phone number
  Helper.findOne({$or: [{ email: req.body.email }, { phoneNumber: req.body.email }]}).then(data => {
    // check password
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      // return result true and user informations (token, name, favorite lessons array, ...) if login successful
      res.json({ 
        result: true,
        token: data.token,
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: data.avatar,
       });
    } else {
      res.json({ result: false, error: 'Identifiant ou mot de passe non valide' });
    }
  });
});

// Tracked help requests list route
router.get('/trackedHelpRequests/:token', (req, res) => {
  Helper.findOne({ token: req.params.token }).populate('trackedHelpRequests')
  .then(data => {
    if (data) {
      res.json({ result: true, trackedHelpRequests: data.trackedHelpRequests });
    } else {
      res.json({ result: false, error: 'Aideur non trouvé' });
    }
  });
});

// add to tracked help requests route
router.put('/addToTrackedHelpRequests/:token/:helpRequestId', (req, res) => {
  // udpateOne(<filter>,<update>) : we search user by token, then update by adding
  // new help request ID at the end of trackedHelpRequests array
  Helper.updateOne( { token: req.params.token }, { $push: { trackedHelpRequests: req.params.helpRequestId } })
    .then(() => {
      Helper.findOne({ token: req.params.token })
        .then(data => {
          if (data.trackedHelpRequests.includes(req.params.helpRequestId)) {
            res.json({ result: true, event: 'Demande d\'aide suivie' });
          } else {
            res.json({ result: false, error: 'La demande d\'aide n\'a pas pu être ajoutée à la liste des demandes suivies' });
          }
        });
    });
});

// updateAvatar route
router.put('/updateAvatar', (req, res) => {
  if (!checkBody(req.body, ['token', 'url'])) {
    res.json({ result: false, error: 'Formulaire incomplet, merci de renseigner toutes les informations requises' });
    return;
  }
  Helper.updateOne( {token: req.body.token}, {avatar: req.body.url} )
    .then (() => {
      Helper.findOne({ token: req.body.token })
      .then (data => {
        if (data.avatar === req.body.url) {
          res.json({ result: true,  event: 'Image de profil modifiée', url: data.avatar})
        } else {
          res.json({ result: false,  error: 'Echec de la mise à jour de la photo de profil'})
        }
      })
    })
});

// get helper ID route
router.get('/getHelperId/:token', (req, res) => {
  Helper.findOne({ token: req.params.token })
    .then(data => {
      if (data) {
        res.json({ result: true,  helperId: data._id})
      } else {
        res.json({ result: false,  error: 'Aideur non trouvé'})
      }
    });
});

module.exports = router;