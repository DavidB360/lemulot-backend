var express = require('express');
var router = express.Router();
const { checkBody } = require('../modules/checkBody');

require('../models/connection');
const Tutorial = require('../models/tutorials');

// new tutorial route
// this is the intitation of the tutorial with a content made of one text object.
// to continue to build the tutorial with additional text objects and pictures, 
// use the addElementToTutorial route
router.post('/addTutorial', (req, res) => {
    // use module checkbody to detect empty fields
    if (!checkBody(req.body, ['title', 'author', 'device', 'category', 'difficulty', 'content'])) {
        res.json({ result: false, error: 'Champ vide ou manquant' });
        return;
    }
    // Check if the title is not already used for the same type of device 
    Tutorial.findOne({title: req.body.title, device: req.body.device}).then(data => {
    if (data === null) {
        // create new tutorial
        const newTutorial = new Tutorial({
            title: req.body.title,
            author: req.body.author,
            creationDate: Date.now(),
            device: req.body.device,
            category: req.body.category,
            difficulty: req.body.difficulty,
            content: [ { type: 'text', content: req.body.content } ]
        });
        newTutorial.save().then(newtuto => {
        // return result true and event message
            res.json({ result: true, event: `Le tutoriel \"${newtuto.title}\" a été créé avec succès !`});
        });
    } else {
        // tutorial title already exists in database
        res.json({ result: false, error: 'Un tutoriel avec le même titre existe déjà pour le même type d\'équipement.' });
    }
    });
});

// route to add text or picture element to a tutorial identified by its id
// to insert text, just fill content field with it and set the type to 'text'
// to insert a picture, its url has to be set in the content field and the type set to 'image'
router.post('/addElementToTutorial', (req, res) => {
  // use module checkbody to detect empty fields
  if (!checkBody(req.body, ['tutorialId', 'type', 'content'])) {
      res.json({ result: false, error: 'Champ vide ou manquant' });
      return;
  }
  Tutorial.updateOne( { _id: req.body.tutorialId }, { $push: { content: { type: req.body.type, content: req.body.content } }})
    .then(() => {
      Tutorial.findOne({_id: req.body.tutorialId })
      .then((data) => {
        res.json({ result: true, newContent: data.content });
      });
  });
});


// get all tutorials route
router.get('/', (req, res) => {
    Tutorial.find({}).then(data => {
      if (data) {
        res.json({ result: true, tutorials: data });
      } else {
        res.json({ result: false, error: 'tutoriels non trouvés' });
      }
    });
});

// get tutorials sorted by device route
router.get('/filter/:device', (req, res) => {
    Tutorial.find({device: req.params.device}).then(data => {
      if (data) {
        res.json({ result: true, tutorials: data });
      } else {
        res.json({ result: false, error: 'tutoriels non trouvés' });
      }
    });
});

// get tutorials sorted by device and category route
router.get('/filter/:device/:category', (req, res) => {
    Tutorial.find({device: req.params.device, category: req.params.category}).then(data => {
      if (data) {
        res.json({ result: true, tutorials: data });
      } else {
        res.json({ result: false, error: 'tutoriels non trouvés' });
      }
    });
});

// get tutorials by Id route
router.get('/tutoId/:id', (req, res) => {
    Tutorial.findOne({_id: req.params.id}).then(data => {
      if (data) {
        res.json({ result: true, tutorial: data });
      } else {
        res.json({ result: false, error: 'tutoriel non trouvé' });
      }
    });
});

module.exports = router;
