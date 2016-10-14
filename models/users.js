/**
 * Model for users
 */

var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

var Schema = mongoose.Schema;

var passwordSchema = require('./schemas/password');
var locationSchema = require('./schemas/location');

var config = require('config');

var userSchema = new Schema({
  username: { type: String, lowercase: true, unique: true, required: true },
  password: { type: passwordSchema, required: true },
  // TODO: regex email
  email: { type: String, unique: true, required: true },
  location: locationSchema
});

userSchema.methods.generateJWT = function () {
  var payload = {
    _id: this._id,
    username: this.username,
  };

  var options = {
    expiresIn: config.auth.tokenValidity * 1000;
  }

  var token = jwt.sign(payload, config.auth.tokenSecret, options);

  return token;
};

var User = mongoose.model('User', userSchema);

module.exports = User;

/* vim: set ts=2 sw=2 et si colorcolumn=80 : */
