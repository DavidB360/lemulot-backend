const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: String,
  password: String,
  lastName: String,
  firstName: String,
  zipCode: Number,
  city: String,
  phoneNumber: String,
  token: String,
  avatar: String,
  canLike: Boolean,
  favoriteLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'tutorials'}],
  helpRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'helprequests'}]
});

const User = mongoose.model('users', userSchema);

module.exports = User;