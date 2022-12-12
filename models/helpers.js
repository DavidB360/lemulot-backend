const mongoose = require('mongoose');

const helperSchema = mongoose.Schema({
  email: String,
  password: String,
  lastName: String,
  firstName: String,
  zipCode: Number,
  city: String,
  phoneNumber: String,
  token: String,
  avatar: String,
  trackedHelpRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'helprequests'}]
});

const Helper = mongoose.model('helpers', helperSchema);

module.exports = Helper;