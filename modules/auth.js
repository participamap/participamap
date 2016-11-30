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
 * Authentication module
 */

var jwt = require('express-jwt');
var User = require('../models/user');

var config = require('../config.json');

function Auth() {
  this.verify = Auth.verify;
  this.onDone = Auth.onDone;
  this.jwt = Auth.jwt;
}

/**
 * Verify a users’s credentials for passport
 */
Auth.verify = function (username, password, done) {
  User.findOne({ username: username.toLowerCase() },
    function onUserFoundForAuth(error, user) {
      if (error) return done(error);

      if (!user || !user.isValidPassword(password))
        return done(null, false, { message: 'Invalid credentials' });

      done(null, user);
    });
};

/**
 * Creates a callback with actions to take after the authentication process
 */
Auth.onDone = function (req, res, next) {
  return function (error, user, info, status) {
    if (error) return next(error);

    if (!user) {
      var message = (status === 400)
        ? 'Bad Request: '
        : 'Unauthorized: ';
      message += info.message;

      var err = new Error(message);
      err.status = status || 401;
      return next(err);
    }

    req.user = user;
    next();
  };
};

/**
 * Authenticates a user using express-jwt
 */
Auth.jwt = jwt({
  secret: config.auth.secret,
  requestProperty: 'jwt',
  credentialsRequired: false
});

module.exports = Auth;

/* vim: set ts=2 sw=2 et si cc=80 : */
