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
 * Checking module
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

function Checks() {
  this.db = Checks.db;
  this.isValidObjectId = Checks.isValidObjectId;
  this.auth = Checks.auth;
  this.setAdminFlag = Checks.setAdminFlag;
}

/**
 * Checks if the database is connected
 */
Checks.db = function (req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    var err = new Error('Database Error');
    err.details = 'MongoDB is not connected';
    return next(err);
  }

  next();
};

/**
 * Checks if an ObjectId is valid
 */
Checks.isValidObjectId = function (req, res, next, id) {
  if (!ObjectId.isValid(id)) {
    var err = new Error('Bad Request: Invalid ID');
    err.status = 400;
    return next(err);
  }

  next();
};

/**
 * Checks if a user is authorized to access the ressource
 */
Checks.auth = function (requiredRole) {
  return function (req, res, next) {
    if (!req.jwt) {
      var err = new Error('Unauthorized: No token was found');
      err.status = 401;
      return next(err);
    }

    var jwt = req.jwt;

    // TODO: Centraliser la définition des rôles
    var roles = {
      "user": 1,
      "content-owner": 2,
      "moderator": 3,
      "admin": 4
    };

    if (roles[jwt.role] < roles[requiredRole] && jwt._id != req.owner) {
      var err = new Error('Forbidden: Unsufficient permissions');
      err.status = 403;
      return next(err);
    }

    next();
  };
};

module.exports = Checks;

/* vim: set ts=2 sw=2 et si cc=80 : */
