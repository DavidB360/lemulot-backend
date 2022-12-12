const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    author: String,
    messageTime: Date,
    content: String
});

const helpRequestSchema = mongoose.Schema({
    title: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    creationDate: Date,
    messages: [messageSchema],
    helpers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'helpers'}]
});

const HelpRequest = mongoose.model('helprequests', helpRequestSchema);

module.exports = HelpRequest;