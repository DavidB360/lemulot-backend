const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'users'} | { type: mongoose.Schema.Types.ObjectId, ref: 'helpers'},
    messageTime: Date,
    content: String
});

const helpRequestSchema = mongoose.Schema({
    title: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    creationDate: Date,
    isSolved: Boolean,
    messages: [messageSchema],
    helpers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'helpers'}]
});

const HelpRequest = mongoose.model('helprequests', helpRequestSchema);

module.exports = HelpRequest;