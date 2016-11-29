var express = require('express');
var passport = require('passport');
var RateLimit = require('express-rate-limit');

var Checks = require('../../modules/checks');
var Auth = require('../../modules/auth');

var User = require('../../models/user');

var config = require('../../config.json');

var router = express.Router({ strict: true });

// Login rate limiter
var ws = config.rateLimiter.login.windowSizeMin;
var loginLimiter = new RateLimit({
  windowMs: ws * 60 * 1000,
  delayAfter: 1,
  delayMs: 2 * 1000,
  max: config.rateLimiter.login.max,
  message: 'Too many login attemps from this IP. Please retry in ' + ws
    + ' minutes'
});

router.get('/', getRoot);
router.post('/register', Checks.db, register, sendToken);
router.post('/login', loginLimiter, Checks.db, login, sendToken);


function getRoot(req, res, next) {
  var infos = {
    name: 'participamap',
    apiVersion: 1,
  };

  res.json({infos: infos});
}


function register(req, res, next) {
  if (!req.body.username) {
    var err = new Error('Bad Request: username is missing');
    err.status = 400;
    return next(err);
  }

  if (!req.body.password) {
    var err = new Error('Bad Request: password is missing');
    err.status = 400;
    return next(err);
  }

  if (!req.body.email) {
    var err = new Error('Bad Request: email is missing');
    err.status = 400;
    return next(err);
  }

  var user = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  });

  user.save(function onUserRegistered(error) {
    if (error) return next(error);

    req.user = user;
    next();
  });
}


function login(req, res, next) {
  var onAuthDone = Auth.onDone(req, res, next);
  var auth = passport.authenticate('local', { session: false }, onAuthDone);

  auth(req, res, next);
}


function sendToken(req, res, next) {
  res.json({ token: req.user.generateJWT() });
}

module.exports = router;

/* vim: set ts=2 sw=2 et si cc=80 : */
