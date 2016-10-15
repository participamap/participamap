var express = require('express');
var passport = require('passport');

var Checks = require('../modules/checks');
var Auth = require('../modules/auth');

var User = require('../models/user');

var router = express.Router({ strict: true });

router.get('/', getRoot);
router.post('/register', Checks.db, register, sendToken);
router.post('/login', Checks.db, login, sendToken);


function getRoot(req, res, next) {
  res.json({});
}


function register(req, res, next) {
  var user = new User(req.body);

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

/* vim: set ts=2 sw=2 et si colorcolumn=80 : */
