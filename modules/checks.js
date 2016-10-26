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
