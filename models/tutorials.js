const mongoose = require('mongoose');

const tutorialSchema = mongoose.Schema({
    title: String,
    author: String,
    creationDate: Date,
    link: String
});

const Tutorial = mongoose.model('tutorials', tutorialSchema);

module.exports = Tutorial;