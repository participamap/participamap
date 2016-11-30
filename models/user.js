/**
 * Participamap – A free cultural, citizen and participative mapping project.
 * Copyright (c) 2016 The Participamap Developers
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


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
  // TODO: Centraliser la définition des rôles
  role: {
    type: String,
    enum: ['user', 'content-owner', 'moderator', 'admin'],
    default: 'user',
    required: true
  },
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
    usr: this.username,
    role: this.role
  };

  var options = {
    expiresIn: config.auth.tokenValidity
  };

  var token = jwt.sign(payload, config.auth.secret, options);

  return token;
};

var User = mongoose.model('User', userSchema);

module.exports = User;

/* vim: set ts=2 sw=2 et si cc=80 : */
