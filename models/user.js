/**
 * Model for users
 */

var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var Schema = mongoose.Schema;

var config = require('../config.json');

// Password-based key derivation options. If this is changed, the update must
// come with a stript to update all passwords in database.
var pbkd = {
  iterations: 10000,
  keylen: 32,
  digest: 'sha256'
};

var userSchema = new Schema({
  username: { type: String, lowercase: true, unique: true, required: true },
  passwordSalt: { type: String, required: true },
  passwordHash: { type: String, required: true },
  // TODO: regex email
  email: { type: String, unique: true, required: true },
  registrationDate: { type: Date, default: Date.now, required: true }
});

userSchema.virtual('password').set(function (password) {
  var salt = crypto.randomBytes(16).toString('base64');
  var hash = crypto.pbkdf2Sync(password, salt, pbkd.iterations, pbkd.keylen,
    pbkd.digest).toString('base64');
  
  this.passwordSalt = salt;
  this.passwordHash = hash;
});

userSchema.methods.isValidPassword = function (password) {
  var hash = crypto.pbkdf2Sync(password, this.passwordSalt, pbkd.iterations,
    pbkd.keylen, pbkd.digest).toString('base64');

  return this.passwordHash === hash;
};

userSchema.methods.generateJWT = function () {
  var payload = {
    _id: this._id,
    username: this.username,
  };

  var options = {
    expiresIn: config.auth.tokenValidity * 1000
  };

  var token = jwt.sign(payload, config.auth.secret, options);
  
  return token;
};

var User = mongoose.model('User', userSchema);

module.exports = User;

/* vim: set ts=2 sw=2 et si colorcolumn=80 : */
