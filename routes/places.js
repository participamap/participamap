var express = require('express');
var mongoose = require('mongoose');
var url = require('url');

var Checks = require('../modules/checks');
var Utils = require('../modules/utils');

var Place = require('../models/place');
var Comment = require('../models/comment');
var Picture = require('../models/picture');
var Document = require('../models/document');
var Vote = require('../models/vote');
var PendingUpload = require('../models/pending_upload');

var config = require('../config.json');

var router = express.Router({ strict: true });

router.param('id', Checks.isValidObjectId);
router.param('id', Checks.db);
router.param('id', getPlace);

router.param('comment_id', Checks.isValidObjectId);
router.param('comment_id', getComment);

//router.param('picture_id', Checks.isValidObjectId);
//router.param('picture_id', getPicture);

//router.param('document_id', Checks.isValidObjectId);
//router.param('document_id', getDocument);

//router.param('vote_id', Checks.isValidObjectId);
//router.param('vote_id', getVote);

router.get('/', Checks.db, getPlacesHeaders);
router.get('/:id', getPlaceInfo);
router.post('/', Checks.auth('content-owner'), Checks.db, createPlace);
router.put('/:id', Checks.auth('content-owner'), updatePlace);
router.delete('/:id', Checks.auth('content-owner'), deletePlace);
router.get('/:id/comments/', getComments);
router.post('/:id/comments/', Checks.auth('user'), createComment);
router.delete('/:id/comments/:comment_id', Checks.auth('moderator'),
  deleteComment);
router.get('/:id/pictures/', getPictures);
router.post('/:id/pictures/', Checks.auth('user'), createPicture);
//router.delete('/:id/pictures/:picture_id', deletePicture);
//router.get('/:id/documents', getDocuments);
//router.post('/:id/documents', createDocument);
//router.delete('/:id/documents/:document_id', deleteDocument);
//router.get('/:id/votes', getVotes);
//router.post('/:id/votes', createVote);
//router.delete('/:id/votes/:vote_id', deleteVote);


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


function getComment(req, res, next, comment_id) {
  Comment.findById(comment_id, function onCommentFound(error, comment) {
    if (error) return next(error);

    console.log(req.place._id);
    console.log(comment.place);

    // TODO: Pourquoi comment.place !== req.place._id est toujours vrai ? :'(
    if (!comment/* || (comment.place !== req.place._id)*/) {
      var err = new Error('Not Found');
      err.status = 404;
      return next(err);
    }

    req.comment = comment;
    req.owner = comment.author;

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
  
  if (req.jwt) {
    var role = req.jwt.role;

    if (role !== 'content-owner' && role !== 'moderator' && role !== 'admin') {
      // Remove content-owner only info
      place.proposedBy = undefined;
      place.moderateComments = undefined;
      place.moderateDocuments = undefined;
      place.moderatePictures = undefined; 
    }
  }

  res.json(place);
}


function createPlace(req, res, next) {
  var place = new Place(req.body);

  // TODO: Vérifier si content-owner pour les champs content-owner

  if (!req.body.setHeaderPhoto) {
    var onPlaceSaved = Utils.returnSavedEntity(res, next, 201);
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

    var uploadPath = 'upload/' + pendingUpload._id;
    var uploadURL = url.resolve(config.serverURL, uploadPath);
    res.redirect(204, uploadURL);
  }
}


function updatePlace(req, res, next) {
  var place = req.place;
  var modifications = req.body;

  for (attribute in modifications)
    place[attribute] = modifications[attribute];

  if (modifications.deleteHeaderPhoto) {
    // TODO: Supprimer le fichier
    
    place.headerPhoto = undefined;
  }

  // TODO: Factoriser du code
  if (!modifications.setHeaderPhoto) {
    var onPlaceSaved = Utils.returnSavedEntity(res, next);
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

    var uploadPath = 'upload/' + pendingUpload._id;
    var uploadURL = url.resolve(config.serverURL, uploadPath);
    res.redirect(204, uploadURL);
  }
}


function deletePlace(req, res, next) {
  var place = req.place;

  Comment.remove({ place: place._id }, onRemoved);
  Picture.remove({ place: place._id }, onRemoved);
  Document.remove({ place: place._id }, onRemoved);
  Vote.remove({ place: place._id }, onRemoved);

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


function getComments(req,res,next) {
  var place = req.place;
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
  
  Comment.find({ place: place._id }, { __v: false, place: false })
    .sort('-date')
    .skip((page - 1) * n)
    .limit(n)
    .exec(function returnComments(error, comments) {
      if (error) return next(error);
      res.json(comments);
    });
}


function createComment(req, res, next) {
  var place = req.place;

  var comment = new Comment(req.body);
  comment.place = place._id;
  comment.author = mongoose.Types.ObjectId(req.jwt._id);

  var onCommentSaved = Utils.returnSavedEntity(res, next, 201);
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
function getPictures(req,res,next) {
  var place = req.place;
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

  Picture.find({ place: place._id }, { __v: false, place: false })
    .sort('-date')
    .skip((page - 1) * n)
    .limit(n)
    .exec(function returnPictures(error, pictures) {
      if (error) return next(error);
      res.json(pictures);
    });
}


function createPicture(req, res, next) {
  var place = req.place;
  
  // Not a Picture object in order to get the real timestamp on picture upload
  var picture = {};
  picture.place = place._id;
  // TODO: Véritable auteur
  picture.author = mongoose.Types.ObjectId(req.jwt._id);

  var pendingUpload = new PendingUpload({
    contentType: 'picture',
    content: picture
  });
  pendingUpload.save(sendUploadURL);

  // TODO: Factoriser avec les autres requêtes utilisant l’upload
  function sendUploadURL(error, pendingUpload) {
    if (error) return next(error);

    var uploadPath = 'upload/' + pendingUpload._id;
    var uploadURL = url.resolve(config.serverURL, uploadPath);
    res.redirect(204, uploadURL);
  }
}


module.exports = router;

/* vim: set ts=2 sw=2 et si colorcolumn=80 : */
