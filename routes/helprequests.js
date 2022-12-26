var express = require('express');
var router = express.Router();

require('../models/connection');
const HelpRequest = require('../models/helprequests');
const { checkBody } = require('../modules/checkBody');




// addMessage
// router.put('/artists/:position', (req, res) => {
//   artists[req.params.position] = req.body.replacementArtist;
//   res.json({ artistsList: artists });
//  });

// editHelpRequestStatus
// router.put('/artists/:position', (req, res) => {
//   artists[req.params.position] = req.body.replacementArtist;
//   res.json({ artistsList: artists });
//  });


module.exports = router;
