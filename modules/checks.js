/**
 * Checking module
 */

var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectId;

function Checks() {
  this.db = Checks.db;
  this.isValidObjectId = Checks.isValidObjectId;
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
 * Checks if a user is admin and sets a flag
 */
Checks.setAdminFlag = function (req, res, next) {
  // TODO: Faire une vraie vérification

  req.admin = true;
  next();
};

module.exports = Checks;

/* vim: set ts=2 sw=2 et si colorcolumn=80 : */
