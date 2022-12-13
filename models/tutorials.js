const mongoose = require('mongoose');

const tutorialSchema = mongoose.Schema({
    title: String,
    author: String,
    creationDate: Date,
    device: String,
    category: String,
    difficulty: String,
    content: String
});

const Tutorial = mongoose.model('tutorials', tutorialSchema);

module.exports = Tutorial;