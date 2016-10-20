/**
 * Utilitaries module
 */

var unique = require('array-unique');

var User = require('../models/user');

function Utils() {
  this.returnSavedEntity = Utils.returnSavedEntity;
  this.send = Utils.send;
  this.cleanEntityToSend = Utils.cleanEntityToSend;
  this.listAuthorsInObjectsToSend = Utils.listAuthorsInObjectsToSend;
  this.getAuthorsInfos = Utils.getAuthorsInfos;
  this.addAuthorsNames = Utils.addAuthorsNames;
}

/**
 * Creates a callback to return an entity after saving it in the database
 */
<<<<<<< HEAD
Utils.returnSavedEntity = function (res, next) {
  return function (error, savedEntity) {
    if (error) return next(error);

    if (!status) var status=200;

    // Remove unwanted info
    savedEntity.__v = undefined;
    savedEntity.place = undefined;
=======
Utils.returnSavedEntity = function (req, res, next, status) {
  return function (error, savedEntity) {
    if (error) return next(error);

    if (status) res.status(status);

    req.toSend = savedEntity.toObject();
    next();
  };
};

/**
 * Create a middleware to send the response
 */
Utils.send = function (req, res, next) {
  res.json(req.toSend);
};

/**
 * Creates a middleware to clean the entity to send
 */
Utils.cleanEntityToSend = function (attributes = []) {
  return function (req, res, next) {
    req.toSend.__v = undefined;

    var i, len;
    for (i = 0, len = attributes.length; i < len; i++)
      req.toSend[attributes[i]] = undefined;
>>>>>>> e6920bb382031a5d482f9fa62a7a2cc53aa53381

    next();
  };
};

/**
 * List authors in an array of objects to send in req.authors
 */
Utils.listAuthorsInObjectsToSend = function (req, res, next) {
  var authors = [];

  if (Array.isArray(req.toSend)) {
    var i, len;
    for (i = 0, len = req.toSend.length; i < len; i++)
      if (req.toSend[i].author)
        authors.push(req.toSend[i].author);
  }
  else {
    var author = req.toSend.author || req.toSend.proposedBy;
    if (author)
      authors.push(author);
  }

  if (authors.length === 0)
    return next();

  var i, len;
  for (i = 0, len = authors.length; i < len; i++)
    authors[i] = authors[i].toString();

  unique(authors);

  req.authors = authors;
  next();
};

/**
 * Construct a dictionary of userids to names in req.authorsNames given a list
 * of usersids in req.authors
 */
Utils.getAuthorsInfos = function (req, res, next) {
  if (!req.authors)
    return next();

  var filter = {
    $or: []
  };

  var i, len;
  for (i = 0, len = req.authors.length; i < len; i++)
    filter.$or.push({ _id: req.authors[i] });

  var projection = { username: true };

  User.find(filter, projection, function onAuthorsFound(error, authors) {
    if (error) return next(error);

    var names = {};

    var i, len;
    for (i = 0, len = authors.length; i < len; i++) {
      names[authors[i]._id] = authors[i].username;
    }

    req.authorsNames = names;
    next();
  });
};

/**
 * Replace author ids by ids and names in an array of objects to send
 */
Utils.addAuthorsNames = function (req, res, next) {
  if (!req.authorsNames)
    return next();

  if (Array.isArray(req.toSend)) {
    var i, len;
    for (i = 0, len = req.toSend.length; i < len; i++) {
      var authorId = req.toSend[i].author;

      req.toSend[i].author = {
        id: authorId,
        name: req.authorsNames[authorId]
      };
    }
  }
  else {
    var authorId = req.toSend.author || req.toSend.proposedBy;
    var author = {
      id: authorId,
      name: req.authorsNames[authorId]
    };

    if (req.toSend.author)
      req.toSend.author = author;
    else if (req.toSend.proposedBy)
      req.toSend.proposedBy = author;
  }

  next();
};

module.exports = Utils;

/* vim: set ts=2 sw=2 et si cc=80 : */
