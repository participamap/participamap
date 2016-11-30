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
 * Utilitaries module
 */

var unique = require('array-unique');

var User = require('../models/user');
var Place = require('../models/place');
var Comment = require('../models/comment');
var Picture = require('../models/picture');
var Document = require('../models/document');

function Utils() {
  this.returnSavedEntity = Utils.returnSavedEntity;
  this.send = Utils.send;
  this.cleanEntityToSend = Utils.cleanEntityToSend;
  this.listAuthorsInObjectsToSend = Utils.listAuthorsInObjectsToSend;
  this.getAuthorsInfos = Utils.getAuthorsInfos;
  this.addAuthorsNames = Utils.addAuthorsNames;
  this.listReportedContentsInObjectsToSend
    = Utils.listReportedContentsInObjectsToSend;
  this.getObjects = Utils.getObjects;
  this.replaceByObjects = Utils.replaceByObjects;
}

/**
 * Creates a callback to return an entity after saving it in the database
 */
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
    for (i = 0, len = authors.length; i < len; i++)
      names[authors[i]._id] = authors[i].username;

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
        name: req.authorsNames[authorId] || 'Utilisateur Supprimé'
      };
    }
  }
  else {
    var authorId = req.toSend.author || req.toSend.proposedBy;
    var author = {
      id: authorId,
      name: req.authorsNames[authorId] || 'Utilisateur Supprimé'
    };

    if (req.toSend.author)
      req.toSend.author = author;
    else if (req.toSend.proposedBy)
      req.toSend.proposedBy = author;
  }

  next();
};

/**
 * List reported contents IDs in an array of objects to send in
 * req.reportedContents
 */
Utils.listReportedContentsInObjectsToSend = function (req, res, next) {
  var reportedContents = {
    place: [],
    comment: [],
    picture: [],
    document: []
  };

  if (Array.isArray(req.toSend)) {
    var i, len;
    for (i = 0, len = req.toSend.length; i < len; i++) {
      if (req.toSend[i].reportedContent) {
        reportedContents[req.toSend[i].type]
          .push(req.toSend[i].reportedContent);
      }
    }
  }
  else {
    if (req.toSend.reportedContent)
      reportedContents[req.toSend.type].push(req.toSend.reportedContent);
  }

  if (reportedContents.place.length === 0
    && reportedContents.comment.length === 0
    && reportedContents.picture.length === 0
    && reportedContents.document.length === 0)
  {
    return next();
  }

  for (var type in reportedContents) {
    var i, len;
    for (i = 0, len = reportedContents[type].length; i < len; i++)
      reportedContents[type][i] = reportedContents[type][i].toString();

    unique(reportedContents[type]);
  }

  req.reportedContents = reportedContents;
  next();
};

/**
 * Construct dictionaries of ObjectIds to objects in req.objects given lists
 * of ObjectIds in req.reportedContents
 */
Utils.getObjects = function (req, res, next) {
  if (!req.reportedContents)
    return next();

  var filter = {
    $or: []
  };

  var filters = {
    place: filter,
    comment: filter,
    picture: filter,
    document: filter
  };

  req.objects = {};

  for (var type in req.reportedContents)
    getObjectsOfType(type);

  function getObjectsOfType(type) {
    if (req.reportedContents[type].length === 0) {
      req.objects[type] = false;
    }
    else {
      var i, len;
      for (i = 0, len = req.reportedContents[type].length; i < len; i++)
        filters[type].$or.push({ _id: req.reportedContents[type][i] });
      
      switch (type) {
        case 'place':
          var Type = Place;
          break;

        case 'comment':
          var Type = Comment;
          break;

        case 'picture':
          var Type = Picture;
          break;

        case 'document':
          var Type = Document;
          break

        default:
          var err = new Error('Bad object type');
          return next(err);
      }

      Type.find(filters[type], { __v: false },
        function onObjectsFound(error, objects) {
          if (error) return next(error);

          var dict = {};

          var i, len;
          for (i = 0, len = objects.length; i < len; i++)
            dict[objects[i]._id] = objects[i];

          req.objects[type] = dict;
          sync();
        });
    }
  }

  function sync() {
    if (req.objects.place !== undefined
      && req.objects.comment !== undefined
      && req.objects.picture !== undefined
      && req.objects.document !== undefined
      && !req.isSynchronized)
    {
      req.isSynchronized = true;
      next();
    }
  }
};

/**
 * Replace reportedContent ObjectIds by Objects in an array of objects to send
 */
Utils.replaceByObjects = function (req, res, next) {
  if (!req.objects)
    return next();

  if (Array.isArray(req.toSend)) {
    var i, len;
    for (i = 0, len = req.toSend.length; i < len; i++) {
      var type = req.toSend[i].type;
      var id = req.toSend[i].reportedContent;

      req.toSend[i].reportedContent = req.objects[type][id];
    }
  }
  else {
    var type = req.toSend.type;
    var id = req.toSend.reportedContent;

    req.toSend.reportedContent = req.objects[type][id];
  }

  next();
};

module.exports = Utils;

/* vim: set ts=2 sw=2 et si cc=80 : */
