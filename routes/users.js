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
    res.json({ result: false, error: 'Champs vides ou manquants' });
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
        zipCode: req.body.zipCode,
        city: req.body.city,
        phoneNumber: req.body.phoneNumber,
        // generate token
        token: uid2(32),
        avatar: null,
        canLike: true,
        favoriteLessons: [],
        helpRequests: []
      });
      newUser.save().then(newUser => {
        // return result true and user informations (token, name) when new user saved in data base
        res.json({ result: true, token: newUser.token, firstName: newUser.firstName, lastName: newUser.lastName });
      });
    } else {
      // User already exists in database
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
  User.findOne({$or: [{ email: req.body.email }, { phoneNumber: req.body.email }]}).then(data => {
    // check password
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      // return result true and user informations (token, name, favorite lessons array, ...) if login successful
      res.json({ 
        result: true,
        token: data.token,
        firstName: data.firstName,
        lastName: data.lastName,
        favoriteLessons: data.favoriteLessons,
        avatar: data.avatar,
       });
    } else {
      res.json({ result: false, error: 'Utilisateur ou mot de passe non valide' });
    }
  });
});

// canLike route
router.get('/canLike/:token', (req, res) => {
  User.findOne({ token: req.params.token }).then(data => {
    if (data) {
      res.json({ result: true, canLike: data.canLike });
    } else {
      res.json({ result: false, error: 'Utilisateur non trouvé' });
    }
  });
});

// favoriteTutorials route
router.get('/favoriteTutorials/:token', (req, res) => {
  User.findOne({ token: req.params.token }).populate('favoriteLessons')
  .then(data => {
    if (data) {
      res.json({ result: true, favoriteTutorials: data.favoriteLessons });
    } else {
      res.json({ result: false, error: 'Utilisateur non trouvé' });
    }
  });
});

// addToFavorites route
router.put('/addToFavorites/:token/:tutorialId', (req, res) => {
  // udpateOne(<filter>,<update>) : we search user by token, then update by adding
  // new tutorial ID at the end of favoriteLessons array
  User.updateOne( { token: req.params.token }, { $push: { favoriteLessons: req.params.tutorialId } })
    .then(() => {
      User.findOne({ token: req.params.token })
        .then(data => {
          // console.log(data.favoriteLessons);
          if (data.favoriteLessons.includes(req.params.tutorialId)) {
            res.json({ result: true, event: 'Tutoriel ajouté aux leçons favorites' });
          } else {
            res.json({ result: false, error: 'Le tutoriel ne peut-être ajouté à vos favoris' });
          }
        });
    });
});
 
// removeFromFavorites route
router.delete('/removeFromFavorites/:token/:tutorialId', (req, res) => {
  // udpateOne(<filter>,<update>) : we search user by token, then remove from favoriteLessons array
  // the tutorial selected by its ID
  User.updateOne( { token: req.params.token }, { $pull: { favoriteLessons: req.params.tutorialId } })
    .then(() => {
      User.findOne({ token: req.params.token })
        .then(data => {
          // console.log(data.favoriteLessons);
          if (data.favoriteLessons.includes(req.params.tutorialId)) {
            res.json({ result: false, error: 'Le tutoriel n\'a pas été supprimé' });
          } else {
            res.json({ result: true, event: 'Tutoriel supprimé de la liste des favoris' });
          }
        });
    });
});

// Personnal helpRequests list route
router.get('/myHelpRequests/:token', (req, res) => {
  User.findOne({ token: req.params.token }).populate('helpRequests')
  .then(data => {
    if (data) {
      res.json({ result: true, myHelpRequests: data.helpRequests });
    } else {
      res.json({ result: false, error: 'Utilisateur non trouvé' });
    }
  });
});

// addToHelpRequests route
router.put('/addToHelpRequests/:token/:helpRequestId', (req, res) => {
  // udpateOne(<filter>,<update>) : we search user by token, then update by adding
  // new help request ID at the end of helpRequests array
  User.updateOne( { token: req.params.token }, { $push: { helpRequests: req.params.helpRequestId } })
    .then(() => {
      User.findOne({ token: req.params.token })
        .then(data => {
          if (data.helpRequests.includes(req.params.helpRequestId)) {
            res.json({ result: true, event: 'Demande d\'aide ajoutée à liste de demandes personnelles' });
          } else {
            res.json({ result: false, error: 'La demande d\'aide n\'a pu être ajoutée à la liste de demandes personnelles' });
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
  User.updateOne( {token: req.body.token}, {avatar: req.body.url} )
    .then (() => {
      User.findOne({ token: req.body.token })
      .then (data => {
        if (data.avatar === req.body.url) {
          res.json({ result: 'true',  event: 'Image de profil modifiée', url: data.avatar})
        } else {
          res.json({ result: 'false',  error: 'Echec de la mise à jour de la photo de profil'})
        }
      })
    })
});

module.exports = router;