var express = require('express');
var mongoose = require('mongoose');

var Checks = require('../modules/checks');
var Utils = require('../modules/utils');

var Place = require('../models/place');
var Comment = require('../models/comment');
var Picture = require('../models/picture');
var Document = require('../models/document');
var AbuseReported = require('../models/abuseReported');
var Vote = require('../models/vote');
var PendingUpload = require('../models/pending_upload');

var config = require('../config.json');

var router = express.Router();

router.param('id', Checks.isValidObjectId);
router.param('id', getPlace);

router.param('comment_id', Checks.isValidObjectId);
router.param('comment_id', getComment);

router.get('/', Checks.db, getPlacesHeaders);
router.get('/:id', Checks.db, Checks.setAdminFlag, getPlaceInfo);
router.post('/', Checks.db, createPlace);
router.delete('/:id', Checks.db, deletePlace);
router.get('/:id/comments', Checks.db, getComments);
router.post('/:id/comments', Checks.db, createComment);
router.delete('/:id/comments/:comment_id', Checks.db, deleteComment);
router.get('/:id/pictures', Checks.db, getPictures);
router.post('/:id/pictures', Checks.db, createPicture);
router.post('/:id/abuse/:comment_id', Checks.db, createAbuseReport);


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
  
  // TODO: À réécrire de façon plus jolie (gestion des erreurs avant action)
  if (!req.query.admin || req.query.admin === 'false') {
    // Remove admin-olny info
    place.proposedBy = undefined;
    place.moderateComments = undefined;
    place.moderateDocuments = undefined;
    place.moderatePictures = undefined; 
  }
  else if (req.query.admin === 'true') {
    // Check if admin flag is set by Checks.setAdminFlag
    if (!req.admin) {
      var err = new Error('Unauthorized');
      err.status = 401;
      return next(err);
    }
  }
  else {
    var err = new Error('Bad Request: admin must be true or false');
    err.status = 400;
    return next(err);
  }

  res.json(place);
}


function createPlace(req, res, next) {
  var place = new Place(req.body);

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

    var uploadURL = config.serverURL + '/upload/' + pendingUpload._id;
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
  // TODO: Véritable auteur
  comment.author = mongoose.Types.ObjectId("57dbe334c3eaf116f88eca27");

  var onCommentSaved = Utils.returnSavedEntity(res, next, 201);
  comment.save(onCommentSaved);
}

function createAbuse(req, res, next) {
  var place = req.place;

  var abuse = new AbuseReported(req.body);
  // TODO: Véritable auteur
  abuse.user = mongoose.Types.ObjectId("57e4d06ff0653747e4559bfe");

  var onAbuseSaved = Utils.returnSavedEntity(res, next, 201);
  abuse.save(onAbuseSaved);
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
  picture.author = mongoose.Types.ObjectId("57dbe334c3eaf116f88eca27");

  var pendingUpload = new PendingUpload({
    contentType: 'picture',
    content: picture
  });
  pendingUpload.save(sendUploadURL);

  // TODO: Factoriser avec les autres requêtes utilisant l’upload
  function sendUploadURL(error, pendingUpload) {
    if (error) return next(error);

    var uploadURL = config.serverURL + '/upload/' + pendingUpload._id;
    res.redirect(204, uploadURL);
  }
}


module.exports = router;

/* vim: set ts=2 sw=2 et si colorcolumn=80 : */
