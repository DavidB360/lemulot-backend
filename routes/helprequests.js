var express = require('express');
var router = express.Router();
const { checkBody } = require('../modules/checkBody');

require('../models/connection');
const HelpRequest = require('../models/helprequests');

// new help request route
// this is the intitation of a test request with a title and an author (user_Id)
// To continue to build the help request with text messages and pictures, 
// use the addMessage route
router.post('/newHelpRequest', (req, res) => {
    // use module checkbody to detect empty fields
    if (!checkBody(req.body, ['title', 'author'])) {
        res.json({ result: false, error: 'Champ vide ou manquant' });
        return;
    }
    // create new help request
    const newHelpRequest = new HelpRequest({
        title: req.body.title,
        author: req.body.author,
        creationDate: Date.now(),
        isSolved: false,
        device: null,
        category: null,
        messages: [],
        helpers: [],
    });
    newHelpRequest.save().then(newHelp => {
        if (newHelp) {
            // return result true and help request Id
            res.json({result: true, event: `La demande d\'aide \"${newHelp.title}\" a été créée avec succès !`, helpRequestId: newHelp._id});
        } else {
            res.json({result: false, error: 'la demande d\'aide n\'a pas pu être créée'});
        }
    });
});

// route to add text or picture element to a help request identified by its id
// to insert text, just fill content field with it and set the type to 'text'
// to insert a picture, its url has to be set in the content field and the type set to 'image'
router.post('/addMessage', (req, res) => {
    // use module checkbody to detect empty fields
    if (!checkBody(req.body, ['helpRequestId', 'authorType', 'authorId', 'type', 'content'])) {
        res.json({ result: false, error: 'Champ vide ou manquant' });
        return;
    }
    HelpRequest.updateOne( { _id: req.body.helpRequestId }, { 
        $push: { messages: { 
                                authorType: req.body.authorType,
                                authorId: req.body.authorId,
                                messageTime: Date.now(),
                                type: req.body.type,
                                content: req.body.content 
                            }
                }   
    })
    .then(() => {
        HelpRequest.findOne({_id: req.body.helpRequestId })
        .then((data) => {
            res.json({ result: true, newContent: data.messages });        
        });
    });
});

// change Help Request solved status
router.put('/changeStatus/:helpRequestId/:newStatus', (req, res) => {
    HelpRequest.updateOne({ _id: req.params.helpRequestId}, {isSolved: req.params.newStatus})
    .then(() => {
        res.json({ result: true, event: 'Statut mis à jour'})
    });
 });

// get all help requests route
router.get('/', (req, res) => {
    HelpRequest.find({}).then(data => {
      if (data) {
        res.json({ result: true, helpRequests: data });
      } else {
        res.json({ result: false, error: 'Demandes d\'aide non trouvées' });
      }
    });
});

// get help requests sorted by solved status route
router.get('/isSolved/:status', (req, res) => {
    HelpRequest.find({isSolved: req.params.status}).then(data => {
      if (data) {
        res.json({ result: true, helpRequests: data });
      } else {
        res.json({ result: false, error: 'Demandes d\'aide non trouvées' });
      }
    });
});

// get help request by Id route
router.get('/getById/:helpRequestId', (req, res) => {
    HelpRequest.findOne({_id: req.params.helpRequestId}).populate('author').then(data => {
      if (data) {
        res.json({ result: true, helpRequest: data });
      } else {
        res.json({ result: false, error: 'Demande d\'aide non trouvée' });
      }
    });
});

module.exports = router;
