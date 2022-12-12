const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    author: String,
    messageTime: Date,
    content: String
});

const helpRequestSchema = mongoose.Schema({
    title: String,
    author: String,
    creationDate: Date,
    messages: [messageSchema]
});

const HelpRequest = mongoose.model('helprequests', helpRequestSchema);

module.exports = HelpRequest;