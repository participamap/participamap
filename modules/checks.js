/**
 * Checking module
 */

var mongoose = require('mongoose');

function Checks() {
  this.db = Checks.db;
}

/**
 * Checks if the database is connected
 */
Checks.db = function(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    var err = new Error('Database Error');
    err.details = 'MongoDB is not connected';

    return next(err);
  }

  next();
};

module.exports = Checks;

/* vim: set ts=2 sw=2 et si : */
