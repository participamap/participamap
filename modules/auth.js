/**
 * Authentication module
 */

var User = require('../models/user');

function Auth() {
  this.verify = Auth.verify;
  this.onDone = Auth.onDone;
}

/**
 * Verify a users’s credentials for passport
 */
Auth.verify = function (username, password, done) {
  User.findOne({ username: username },
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

module.exports = Auth;

/* vim: set ts=2 sw=2 et si colorcolumn=80 : */
