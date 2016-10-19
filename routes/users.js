var express = require('express');
var mongoose = require('mongoose');

var Checks = require('../modules/checks');
var Utils = require('../modules/utils');

var User = require('../models/user');

var router = express.Router({ strict: true });

router.param('id', Checks.isValidObjectId);
router.param('id', Checks.db);
router.param('id', getUser);

// getUsers
router.get('/',
  Checks.auth('admin'),
  Checks.db,
  getUsers);

// getUserInfo
router.get('/:id',
  Checks.auth('admin'),
  getUserInfo);

// createUser
router.post('/',
  Checks.auth('admin'),
  Checks.db,
  createUser,
  Utils.cleanEntityToSend(['passwordSalt', 'passwordHash']),
  Utils.send);

// updateUser
router.put('/:id',
  Checks.auth('admin'),
  updateUser,
  Utils.cleanEntityToSend(['passwordSalt', 'passwordHash']),
  Utils.send);

// deleteUser
router.delete('/:id',
  Checks.auth('admin'),
  deleteUser);


function getUser(req, res, next, id) {
  var options = {
    __v: false,
    passwordSalt: false,
    passwordHash: false
  };

  User.findById(id, options, function onUserFound(error, user) {
    if (error) return next(error);

    if (!user) {
      var err = new Error('Not Found');
      err.status = 404;
      return next(err);
    }

    req.user = user;
    req.owner = user._id;

    next();
  });
}


function getUsers(req, res, next) {
  var order = 'username';
  var page = 1;
  var n = 0;

  if (req.query.order) {
    switch (req.query.order) {
      case 'username':
        break;

      case 'username-desc':
        order = '-username';
        break;

      case 'date':
        order = 'date';
        break;

      case 'date-desc':
        order = '-date';
        break;

      default:
        var err = new Error('Bad Request: order must be in [username, '
          + 'username-desc, date, date-desc]');
        err.status = 400
        return next(err);
    }
  }

  if (req.query.page) {
    page = parseInt(req.query.page)

    if (isNaN(page)) {
      var err = new Error('Bad Request: page must be an integer');
      err.status = 400;
      return next(err);
    }

    if (page <= 0) {
      var err = new Error('Bad Request: page must be strictly positive');
      err.status = 400;
      return next(err);
    }

    n = 25;
  }

  if (req.query.n) {
    n = parseInt(req.query.n);

    if (isNaN(n)) {
      var err = new Error('Bad Request: n must be an integer');
      err.status = 400;
      return next(err);
    }

    if (n <= 0) {
      var err = new Error('Bad Request: n must be strictly positive');
      err.status = 400;
      return next(err);
    }
  }

  User.find({}, { __v: false, passwordSalt: false, passwordHash: false })
    .sort(order)
    .skip((page - 1) * n)
    .limit(n)
    .exec(function returnUsers(error, users) {
      if (error) return next(error);
      res.json(users);
    });
}


function getUserInfo(req, res, next) {
  res.json(req.user);
}


function createUser(req, res, next) {
  // Delete unchangable attributes
  delete req.body._id;
  delete req.body.passwordSalt;
  delete req.body.passwordHash;

  var user = new User(req.body);

  var onUserSaved = Utils.returnSavedEntity(req, res, next, 201);
  user.save(onUserSaved);
}


function updateUser(req, res, next) {
  var user = req.user;
  var modifications = req.body;
  var role = req.jwt.role;

  if (role !== 'admin' && modifications.role) {
    var err = new Error('Forbidden: Unsufficient permissions to change the '
      + 'role');
    err.status = 403;
    return next(err);
  }

  // Delete unchangeable attributes
  delete modifications._id;
  delete modifications.username;
  delete modifications.passwordSalt;
  delete modifications.passwordHash;

  for (attribute in modifications)
    user[attribute] = modifications[attribute];

  var onUserSaved = Utils.returnSavedEntity(req, res, next);
  user.save(onUserSaved);
}


function deleteUser(req, res, next) {
  var user = req.user;

  user.remove(function onUserRemoved(error) {
    if (error) return next(error);
    res.status(204).end();
  });
}


module.exports = router;

/* vim: set ts=2 sw=2 et si cc=80 : */
