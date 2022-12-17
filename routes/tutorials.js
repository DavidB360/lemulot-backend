var express = require('express');
var router = express.Router();
const { checkBody } = require('../modules/checkBody');

require('../models/connection');
const Tutorial = require('../models/tutorials');

// new tutorial route
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
            content: req.body.content
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
router.get('/byDevice/:device', (req, res) => {
    Tutorial.find({device: req.params.device}).then(data => {
      if (data) {
        res.json({ result: true, tutorials: data });
      } else {
        res.json({ result: false, error: 'tutoriels non trouvés' });
      }
    });
});

// get tutorials sorted by device and category route
router.get('/byDeviceAndCategory/:device/:category', (req, res) => {
    Tutorial.find({device: req.params.device, category: req.params.category}).then(data => {
      if (data) {
        res.json({ result: true, tutorials: data });
      } else {
        res.json({ result: false, error: 'tutoriels non trouvés' });
      }
    });
});

module.exports = router;
