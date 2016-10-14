/**
 * Password schema
 */

var mongoose = require('mongoose');
var crypto = require('crypto');

var Schema = mongoose.Schema;

var passwordSchema = new Schema({
  salt: { type: String, required: true },
  hash: { type: String, required: true }
}, { _id: false});

passwordSchema.methods.set = function(password) {
  this.salt = crypto.randomBytes(16).toString('base64');

  var hash = crypto.pbkdf2Sync(password, this.salt, 100000, 256, 'sha256');
  this.hash = hash.toString('base64');
};

passwordSchema.methods.isValid = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 100000, 256, 'sha256');
  return this.hash === hash.toString('base64');
};

module.exports = passwordSchema;

/* vim: set ts=2 sw=2 et si colorcolumn=80 : */
