const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    // authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'users'} | { type: mongoose.Schema.Types.ObjectId, ref: 'helpers'},
    authorType: String, // users or helpers
    authorId: { type: mongoose.Schema.Types.ObjectId, refPath: 'authorType'},
    messageTime: Date,
    type: String,
    content: String
});

const helpRequestSchema = mongoose.Schema({
    title: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    creationDate: Date,
    isSolved: Boolean,
    device: String,
    category: String,
    messages: [messageSchema],
    helpers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'helpers'}]
});

const HelpRequest = mongoose.model('helprequests', helpRequestSchema);

module.exports = HelpRequest;