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

var express = require('express');
var mongoose = require('mongoose');
var url = require('url');

var Checks = require('../../modules/checks');
var Utils = require('../../modules/utils');

var Place = require('../../models/place');
var Comment = require('../../models/comment');
var Picture = require('../../models/picture');
var Document = require('../../models/document');
var Rating = require('../../models/rating');
var AbuseReport = require('../../models/abuse_report');
var PendingUpload = require('../../models/pending_upload');

var ObjectId = mongoose.Types.ObjectId;

var config = require('../../config.json');

var router = express.Router({ strict: true });

router.param('id', Checks.isValidObjectId);
router.param('id', Checks.db);
router.param('id', getPlace);

router.param('commentId', Checks.isValidObjectId);
router.param('commentId', getComment);

router.param('pictureId', Checks.isValidObjectId);
router.param('pictureId', getPicture);

router.param('documentId', Checks.isValidObjectId);
router.param('documentId', getDocument);

// getPlacesHeaders
router.get('/',
  Checks.db,
  getPlacesHeaders);

// getPlaceInfo
router.get('/:id',
  getPlaceInfo,
  Utils.listAuthorsInObjectsToSend,
  Utils.getAuthorsInfos,
  Utils.addAuthorsNames,
  Utils.send);

// createPlace
router.post('/',
  Checks.auth('user'),
  Checks.db,
  createPlace,
  Utils.cleanEntityToSend(),
  Utils.listAuthorsInObjectsToSend,
  Utils.getAuthorsInfos,
  Utils.addAuthorsNames,
  Utils.send);

// updatePlace
router.put('/:id',
  Checks.auth('content-owner'),
  updatePlace,
  Utils.cleanEntityToSend(),
  Utils.listAuthorsInObjectsToSend,
  Utils.getAuthorsInfos,
  Utils.addAuthorsNames,
  Utils.send);

// deletePlace
router.delete('/:id',
  Checks.auth('content-owner'),
  deletePlace);

// getComments
router.get('/:id/comments/',
  getComments,
  Utils.listAuthorsInObjectsToSend,
  Utils.getAuthorsInfos,
  Utils.addAuthorsNames,
  Utils.send);

// createComment
router.post('/:id/comments/',
  Checks.auth('user'),
  createComment,
  Utils.cleanEntityToSend(['place', 'toModerate']),
  Utils.listAuthorsInObjectsToSend,
  Utils.getAuthorsInfos,
  Utils.addAuthorsNames,
  Utils.send);

// acceptComment
router.post('/:id/comments/:commentId/accept',
  Checks.auth('moderator'),
  acceptComment,
  Utils.cleanEntityToSend(['place']),
  Utils.listAuthorsInObjectsToSend,
  Utils.getAuthorsInfos,
  Utils.addAuthorsNames,
  Utils.send);

// deleteComment
router.delete('/:id/comments/:commentId',
  Checks.auth('moderator'),
  deleteComment);

// getPictures
router.get('/:id/pictures/',
  getPictures,
  Utils.listAuthorsInObjectsToSend,
  Utils.getAuthorsInfos,
  Utils.addAuthorsNames,
  Utils.send);

// createPicture
router.post('/:id/pictures/',
  Checks.auth('user'),
  createPicture);

// acceptPicture
router.post('/:id/pictures/:pictureId/accept',
  Checks.auth('moderator'),
  acceptPicture,
  Utils.cleanEntityToSend(['place']),
  Utils.listAuthorsInObjectsToSend,
  Utils.getAuthorsInfos,
  Utils.addAuthorsNames,
  Utils.send);

// deletePicture
router.delete('/:id/pictures/:pictureId',
  Checks.auth('moderator'),
  deletePicture);

// getDocuments
router.get('/:id/documents/',
  getDocuments,
  Utils.listAuthorsInObjectsToSend,
  Utils.getAuthorsInfos,
  Utils.addAuthorsNames,
  Utils.send);

// createDocument
router.post('/:id/documents/',
  Checks.auth('user'),
  createDocument);

// acceptDocument
router.post('/:id/documents/:documentId/accept',
  Checks.auth('moderator'),
  acceptDocument,
  Utils.cleanEntityToSend(['place']),
  Utils.listAuthorsInObjectsToSend,
  Utils.getAuthorsInfos,
  Utils.addAuthorsNames,
  Utils.send);

// deleteDocument
router.delete('/:id/documents/:documentId',
  Checks.auth('moderator'),
  deleteDocument);

// getUserRating
router.get('/:id/rating',
  Checks.auth('user'),
  getUserRating);

// ratePlace
router.post('/:id/rating',
  Checks.auth('user'),
  ratePlace,
  Utils.cleanEntityToSend(['_id', 'place', 'user']),
  Utils.send);

// reportAbuse for a place
router.post('/:id/report',
  Checks.auth('user'),
  reportAbuse('place'),
  Utils.cleanEntityToSend(),
  Utils.listAuthorsInObjectsToSend,
  Utils.getAuthorsInfos,
  Utils.addAuthorsNames,
  Utils.listReportedContentsInObjectsToSend,
  Utils.getObjects,
  Utils.replaceByObjects,
  Utils.send);

// reportAbuse for a comment
router.post('/:id/comments/:commentId/report',
  Checks.auth('user'),
  reportAbuse('comment'),
  Utils.cleanEntityToSend(),
  Utils.listAuthorsInObjectsToSend,
  Utils.getAuthorsInfos,
  Utils.addAuthorsNames,
  Utils.listReportedContentsInObjectsToSend,
  Utils.getObjects,
  Utils.replaceByObjects,
  Utils.send);

// reportAbuse for a picture
router.post('/:id/pictures/:pictureId/report',
  Checks.auth('user'),
  reportAbuse('picture'),
  Utils.cleanEntityToSend(),
  Utils.listAuthorsInObjectsToSend,
  Utils.getAuthorsInfos,
  Utils.addAuthorsNames,
  Utils.listReportedContentsInObjectsToSend,
  Utils.getObjects,
  Utils.replaceByObjects,
  Utils.send);

// reportAbuse for a document
router.post('/:id/documents/:documentId/report',
  Checks.auth('user'),
  reportAbuse('document'),
  Utils.cleanEntityToSend(),
  Utils.listAuthorsInObjectsToSend,
  Utils.getAuthorsInfos,
  Utils.addAuthorsNames,
  Utils.listReportedContentsInObjectsToSend,
  Utils.getObjects,
  Utils.replaceByObjects,
  Utils.send);


function getPlace(req, res, next, id) {
  Place.findById(id, { __v: false }, function onPlaceFound(error, place) {
    if (error) return next(error);

    if (!place) {
      var err = new Error('Not Found');
      err.status = 404;
      return next(err);
    }

    req.place = place;

    next();
  });
}


function getComment(req, res, next, commentId) {
  Comment.findById(commentId, function onCommentFound(error, comment) {
    if (error) return next(error);

    if (!comment || (comment.place.toString() !== req.place._id.toString())) {
      var err = new Error('Not Found');
      err.status = 404;
      return next(err);
    }

    req.comment = comment;
    req.owner = comment.author;

    next();
  });
}


function getPicture(req, res, next, pictureId) {
  Picture.findById(pictureId, function onPictureFound(error, picture) {
    if (error) return next(error);

    if (!picture || (picture.place.toString() !== req.place._id.toString())) {
      var err = new Error('Not Found');
      err.status = 404;
      return next(err);
    }

    req.picture = picture;
    req.owner = picture.author;

    next();
  });
}


function getDocument(req, res, next, documentId) {
  Document.findById(documentId, function onDocumentFound(error, document) {
    if (error) return next(error);

    if (!document
      || (document.place.toString() !== req.place._id.toString()))
    {
      var err = new Error('Not Found');
      err.status = 404;
      return next(err);
    }

    req.document = document;
    req.owner = document.author;

    next();
  });
}


function getPlacesHeaders(req, res, next) {
  var filter = {};

  // Date filter
  if (req.query.when) {
    var date = (req.query.when === 'now')
      ? new Date()
      : new Date(req.query.when);

    if (isNaN(date.valueOf())) {
      var err = new Error('Bad Request: Invalid date');
      err.status = 400;
      return next(err);
    }

    filter.$and = [
      { $or: [
          { startDate: { $lte: date } },
          { startDate: null }
        ] },
      { $or: [
          { endDate: { $gte: date } },
          { endDate: null }
        ] }
      ];
  }

  // Location filter
  if (req.query.lat || req.query.long || req.query.height || req.query.width) {
    if (!(req.query.lat && req.query.long
      && req.query.height && req.query.width))
    {
      var err = new Error('Bad Request: lat, long, height and width must be '
        + 'set together');
      err.status = 400;
      return next(err);
    }

    var latitude = parseFloat(req.query.lat);
    var longitude = parseFloat(req.query.long);
    var height = parseFloat(req.query.height);
    var width = parseFloat(req.query.width);

    if (isNaN(latitude) || isNaN(longitude) || isNaN(height) || isNaN(width)) {
      var err = new Error('Bad Request: lat, long, height and width must be '
        + 'numbers');
      err.status = 400;
      return next(err);
    }

    var minLatitude = latitude - height / 2.0;
    var maxLatitude = latitude + height / 2.0;
    var minLongitude = longitude - width / 2.0;
    var maxLongitude = longitude + width / 2.0;

    if (!Array.isArray(filter.$and))
      filter.$and = [];

    filter.$and.push(
      { "location.latitude": { $gte: minLatitude } },
      { "location.latitude": { $lte: maxLatitude } },
      { "location.longitude": { $gte: minLongitude } },
      { "location.longitude": { $lte: maxLongitude } });
  }

  // Get only the header
  var projection = {
    location: true,
    title: true,
    headerPhoto: true
  };

  Place.find(filter, projection,
    function returnPlacesHeaders(error, placesHeaders) {
      if (error) return next(error);
      res.json(placesHeaders);
    });
}


function getPlaceInfo(req, res, next) {
  var place = req.place;

  var role = req.jwt
    ? req.jwt.role
    : 'guest';

  if (role !== 'content-owner' && role !== 'moderator' && role !== 'admin') {
    // Remove content-owner only info
    place.proposedBy = undefined;
  }

  req.toSend = place.toObject();
  next();
}


function createPlace(req, res, next) {
  // Delete unchangeable attributes
  delete req.body._id;
  delete req.body.__v;
  delete req.body.headerPhoto;
  delete req.body.rating;

  var place = new Place(req.body);
  var role = req.jwt.role;

  if (role !== 'content-owner' && role !== 'moderator' && role !== 'admin') {
    if (place.isVerified !== false
      || place.moderateComments !== undefined
      || place.moderatePictures !== undefined
      || place.moderateDocuments !== undefined
      || place.denyComments !== undefined
      || place.denyPictures !== undefined
      || place.denyDocuments !== undefined)
    {
      var err = new Error('Forbidden: Some attributes require higher '
        + 'permissions');
      err.status = 403;
      return next(err);
    }
  }

  place.proposedBy = ObjectId(req.jwt._id);

  if (!req.body.setHeaderPhoto) {
    var onPlaceSaved = Utils.returnSavedEntity(req, res, next, 201);
    place.save(onPlaceSaved);
  }
  else {
    place.validate(function onPlaceValidated(error) {
      if (error) return next(error);

      var pendingUpload = new PendingUpload({
        contentType: 'place',
        content: place
      });
      pendingUpload.save(sendUploadURL);
    });
  }

  function sendUploadURL(error, pendingUpload) {
    if (error) return next(error);

    var uploadPath = 'api/v1/upload/' + pendingUpload._id;
    var uploadURL = url.resolve(config.serverURL, uploadPath);
    res.redirect(204, uploadURL);
  }
}


function updatePlace(req, res, next) {
  var place = req.place;
  var changes = req.body;

  // Delete unchangeable attributes
  delete changes._id;
  delete changes.__v;
  delete changes.proposedBy;
  delete changes.headerPhoto;
  delete changes.rating;

  for (attribute in changes)
    place[attribute] = changes[attribute];

  if (changes.deleteHeaderPhoto) {
    // TODO: Supprimer le fichier

    place.headerPhoto = undefined;
  }

  // TODO: Factoriser du code
  if (!changes.setHeaderPhoto) {
    var onPlaceSaved = Utils.returnSavedEntity(req, res, next);
    place.save(onPlaceSaved);
  }
  else {
    place.validate(function onPlaceValidated(error) {
      if (error) return next(error);

      var pendingUpload = new PendingUpload({
        contentType: 'place',
        content: place,
        toUpdate: true
      });
      pendingUpload.save(sendUploadURL);
    });
  }

  function sendUploadURL(error, pendingUpload) {
    if (error) return next(error);

    var uploadPath = 'api/v1/upload/' + pendingUpload._id;
    var uploadURL = url.resolve(config.serverURL, uploadPath);
    res.redirect(204, uploadURL);
  }
}


function deletePlace(req, res, next) {
  var place = req.place;

  Comment.remove({ place: place._id }, onRemoved);
  Picture.remove({ place: place._id }, onRemoved);
  Document.remove({ place: place._id }, onRemoved);

  // TODO: Supprimer la référence dans les parcours

  // TODO: Meilleure gestion (pour l’instant seule la première erreur
  // déclenchée est retournée
  function onRemoved(error) {
    if (error) return next(error);
  }

  place.remove(function onPlaceRemoved(error) {
    if (error) return next(error);

    // TODO: Supprimer les fichiers liés (headerPhoto, photos, documents, …)

    res.status(204).end();
  });
}


function getComments(req, res, next) {
  var place = req.place;

  var role = req.jwt
    ? req.jwt.role
    : 'guest';

  var page = 1;
  var n = 0;

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

    n = 10;
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

  var filter = { place: place._id };

  if (req.query.tomoderate === 'true') {
    if (role !== 'moderator' && role !== 'admin') {
      var err = new Error('Forbidden: Insufficient permissions to view '
        + 'unmoderated comments');
      err.status = 403;
      return next(err);
    }

    filter.toModerate = true;
    var sort = 'date';
  }
  else {
    var sort = '-date';
  }

  var projection = {
    __v: false,
    place: false
  };

  if (role !== 'moderator' && role !== 'admin') {
    filter.toModerate = { $ne: true };
    projection.toModerate = false;
  }

  Comment.find(filter, projection)
    .sort(sort)
    .skip((page - 1) * n)
    .limit(n)
    .lean()
    .exec(function returnComments(error, comments) {
      if (error) return next(error);

      req.toSend = comments;
      next();
    });
}


function createComment(req, res, next) {
  var place = req.place;

  if (place.denyComments) {
    var err = new Error('Forbidden: Comments are denied on this place');
    err.status = 403;
    return next(err);
  }

  var comment = new Comment({
    place: place._id,
    author: ObjectId(req.jwt._id),
    content: req.body.content
  });

  if (place.moderateComments)
    comment.toModerate = true;

  var onCommentSaved = Utils.returnSavedEntity(req, res, next, 201);
  comment.save(onCommentSaved);
}


function acceptComment(req, res, next) {
  var comment = req.comment;

  comment.toModerate = undefined;

  var onCommentSaved = Utils.returnSavedEntity(req, res, next);
  comment.save(onCommentSaved);
}


function deleteComment(req, res, next) {
  var comment = req.comment;

  comment.remove(function onCommentRemoved(error) {
    if (error) return next(error);
    res.status(204).end();
  });
}


// TODO: Factoriser le code avec getComments
function getPictures(req, res, next) {
  var place = req.place;

  var role = req.jwt
    ? req.jwt.role
    : 'guest';

  var page = 1;
  var n = 0;

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

    n = 12;
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

  var filter = { place: place._id };

  if (req.query.tomoderate === 'true') {
    if (role !== 'moderator' && role !== 'admin') {
      var err = new Error('Forbidden: Insufficient permissions to view '
        + 'unmoderated pictures');
      err.status = 403;
      return next(err);
    }

    filter.toModerate = true;
    var sort = 'date';
  }
  else {
    var sort = '-date';
  }

  var projection = {
    __v: false,
    place: false
  };

  if (role !== 'moderator' && role !== 'admin') {
    filter.toModerate = { $ne: true };
    projection.toModerate = false;
  }

  Picture.find(filter, projection)
    .sort(sort)
    .skip((page - 1) * n)
    .limit(n)
    .lean()
    .exec(function returnPictures(error, pictures) {
      if (error) return next(error);

      req.toSend = pictures;
      next();
    });
}


function createPicture(req, res, next) {
  var place = req.place;

  if (place.denyPictures) {
    var err = new Error('Forbidden: Pictures are denied on this place');
    err.status = 403;
    return next(err);
  }

  // Not a Picture object in order to get the real timestamp on picture upload
  var picture = {
    place: place._id,
    author: ObjectId(req.jwt._id)
  };

  if (place.moderatePictures)
    picture.toModerate = true;

  var pendingUpload = new PendingUpload({
    contentType: 'picture',
    content: picture
  });
  pendingUpload.save(sendUploadURL);

  // TODO: Factoriser avec les autres requêtes utilisant l’upload
  function sendUploadURL(error, pendingUpload) {
    if (error) return next(error);

    var uploadPath = 'api/v1/upload/' + pendingUpload._id;
    var uploadURL = url.resolve(config.serverURL, uploadPath);
    res.redirect(204, uploadURL);
  }
}


function acceptPicture(req, res, next) {
  var picture = req.picture;

  picture.toModerate = undefined;

  var onPictureSaved = Utils.returnSavedEntity(req, res, next);
  picture.save(onPictureSaved);
}


function deletePicture(req, res, next) {
  var picture = req.picture;

  picture.remove(function onPictureRemoved(error) {
    if (error) return next(error);
    res.status(204).end();
  });
}


// TODO: Factoriser le code avec getComments
function getDocuments(req, res, next) {
  var place = req.place;

  var role = req.jwt
    ? req.jwt.role
    : 'guest';

  var page = 1;
  var n = 0;

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

    n = 10;
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

  var filter = { place: place._id };

  if (req.query.tomoderate === 'true') {
    if (role !== 'moderator' && role !== 'admin') {
      var err = new Error('Forbidden: Insufficient permissions to view '
        + 'unmoderated documents');
      err.status = 403;
      return next(err);
    }

    filter.toModerate = true;
    var sort = 'date';
  }
  else {
    var sort = '-date';
  }

  var projection = {
    __v: false,
    place: false
  };

  if (role !== 'moderator' && role !== 'admin') {
    filter.toModerate = { $ne: true };
    projection.toModerate = false;
  }

  Document.find(filter, projection)
    .sort(sort)
    .skip((page - 1) * n)
    .limit(n)
    .lean()
    .exec(function returnDocuments(error, documents) {
      if (error) return next(error);

      req.toSend = documents;
      next();
    });
}


function createDocument(req, res, next) {
  var place = req.place;

  if (place.denyDocuments) {
    var err = new Error('Forbidden: Documents are denied on this place');
    err.status = 403;
    return next(err);
  }

  if (!req.body.title) {
    var err = new Error('Bad Request: No title in the request content');
    err.status = 400;
    return next(err);
  }

  // Not a Document object in order to get the real timestamp on document
  // upload
  var document = {
    place: place._id,
    author: ObjectId(req.jwt._id),
    title: req.body.title
  };

  if (place.moderateDocuments)
    document.toModerate = true;

  var pendingUpload = new PendingUpload({
    contentType: 'document',
    content: document
  });
  pendingUpload.save(sendUploadURL);

  // TODO: Factoriser avec les autres requêtes utilisant l’upload
  function sendUploadURL(error, pendingUpload) {
    if (error) return next(error);

    var uploadPath = 'api/v1/upload/' + pendingUpload._id;
    var uploadURL = url.resolve(config.serverURL, uploadPath);
    res.redirect(204, uploadURL);
  }
}


function acceptDocument(req, res, next) {
  var document = req.document;

  document.toModerate = undefined;

  var onDocumentSaved = Utils.returnSavedEntity(req, res, next);
  document.save(onDocumentSaved);
}


function deleteDocument(req, res, next) {
  var document = req.document;

  document.remove(function onDocumentRemoved(error) {
    if (error) return next(error);
    res.status(204).end();
  });
}


function getUserRating(req, res, next) {
  var place = req.place;

  var filter = {
    place: place._id,
    user: req.jwt._id
  };

  var projection = {
    value: true
  };

  Rating.find(filter, projection, function returnUserRating(error, ratings) {
    if (error) return next(error);

    if (ratings.length === 0)
      return res.json({ value: 0 });

    res.json({ value: ratings[0].value });
  });
}


function ratePlace(req, res, next) {
  var place = req.place;

  if (req.body.value === undefined) {
    var err = new Error('Bad Request: A value must be set');
    err.status = 400;
    return next(err);
  }

  var value = parseInt(req.body.value);

  if (isNaN(value) || value < 1 || value > 5) {
    var err = new Error('Bad Request: The value must be an integer between '
      + '1 and 5');
    err.status = 400;
    return next(err);
  }

  var filter = {
    place: place._id,
    user: req.jwt._id
  };

  var projection = {
    value: true
  };

  Rating.find(filter, projection, function upsertUserRating(error, ratings) {
    if (error) return next(error);

    if (ratings.length === 0) {
      var rating = new Rating({
        place: place._id,
        user: req.jwt._id,
        value: value
      });

      rating.save(onRatingSaved);
    }
    else {
      var rating = ratings[0];
      rating.value = value;
      rating.save(onRatingSaved);
    }
  });

  function onRatingSaved(error, rating) {
    if (error) return next(error);

    req.toSend = rating.toObject();
    next();

    // Select all the ratings for this place and update the average
    Rating.find({ place: place._id }, projection, updatePlaceRating);
  }

  function updatePlaceRating(error, ratings) {
    if (error) return console.log(error);

    var sum = 0;
    var len = ratings.length;

    var i
    for (i = 0; i < len; i++)
      sum += ratings[i].value;

    place.rating = sum / len;
    place.save();
  }
}


function reportAbuse(type) {
  return function (req, res, next) {
    var place = req.place;

    var abuseReport = new AbuseReport({
      author: ObjectId(req.jwt._id),
      type: type,
      reportedContent: req[type]._id
    });

    var onAbuseReportSaved = Utils.returnSavedEntity(req, res, next);
    abuseReport.save(onAbuseReportSaved);
  };
}


module.exports = router;

/* vim: set ts=2 sw=2 et si cc=80 : */
