var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

var config = require('../config.json');

var Checks = require('../modules/checks');
var Place = require('../models/place');
var Pending = require('../models/pending');

router.param('id', Checks.isValidObjectId);
router.param('id', getPlace);

router.get('/', Checks.db, getPlacesHeaders);
router.get('/:id', Checks.db, Checks.setAdminFlag, getPlaceInfo);
router.post('/', Checks.db, createPlace);
router.delete('/:id', Checks.db, deletePlace);


function getPlace(req, res, next, id) {
  // Get the place without heavy content like comments, …
  var projection = {
    location: true,
    title: true,
    isVerified: true,
    proposedBy: true,
    type: true,
    headerPhoto: true,
    description: true,
    startDate: true,
    endDate: true,
    moderateComments: true,
    moderatePictures: true,
    moderateDocuments: true,
    denyComments: true,
    denyPictures: true,
    denyDocuments: true
  };

  Place.findById(id, projection, function onPlaceFound(error, place) {
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


function getPlacesHeaders(req, res, next) {
  var filter = {};

  // Date filter
  if (req.query.when) {
    var date = (req.query.when === 'now')
      ? new Date()
      : new Date(req.query.when);

    if (isNaN(date.valueOf())) {
      var err = new Error('Bad request: invalid date');
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
      var err = new Error('Bad request: lat, long, height and width must be '
        + 'set together');
      err.status = 400;
      return next(err);
    }

    var latitude = parseFloat(req.query.lat);
    var longitude = parseFloat(req.query.long);
    var height = parseFloat(req.query.height);
    var width = parseFloat(req.query.width);

    if (isNaN(latitude) || isNaN(longitude) || isNaN(height) || isNaN(width)) {
      var err = new Error('Bad request: lat, long, height and width must be '
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
    var err = new Error('Bad request: admin must be true or false');
    err.status = 400;
    return next(err);
  }

  // TODO: Réécrire pour éviter la redondance de code

  if (req.query.comms) {
    var nComments = parseInt(req.query.comms);

    if (isNaN(nComments)) {
      var err = new Error('Bad request: comms must be an integer');
      err.status = 400;
      return next(err);
    }

    if (nComments <= 0) {
      var err = new Error('Bad request: comms must be strictly positive');
      err.status = 400;
      return next(err);
    }

    var projection = {
      _id: true,
      // Note: $slice: nb ou $slice: [skip, limit]
      comments: { $slice: nComments }
    };
  }

  if (req.query.pics) {
    var nPictures = parseInt(req.query.pics);

    if (isNaN(nPictures)) {
      var err = new Error('Bad request: pics must be an integer');
      err.status = 400;
      return next(err);
    }

    if (nPictures <= 0) {
      var err = new Error('Bad request: pics must be strictly positive');
      err.status = 400;
      return next(err);
    }
    
    if (!projection)
      var projection = { _id: true };

    projection.pictures = { $slice: nPictures };
  }

  if (req.query.docs) {
    var nDocuments = parseInt(req.query.docs);

    if (isNaN(nDocuments)) {
      var err = new Error('Bad request: docs must be an integer');
      err.status = 400;
      return next(err);
    }

    if (nDocuments <= 0) {
      var err = new Error('Bad request: docs must be strictly positive');
      err.status = 400;
      return next(err);
    }
    
    if (!projection)
      var projection = { _id: true };

    projection.documents = { $slice: nDocuments };
  }

  if (req.query.votes) {
    var nVotes = parseInt(req.query.votes);

    if (isNaN(nVotes)) {
      var err = new Error('Bad request: votes must be an integer');
      err.status = 400;
      return next(err);
    }

    if (nVotes <= 0) {
      var err = new Error('Bad request: votes must be strictly positive');
      err.status = 400;
      return next(err);
    }
    
    if (!projection)
      var projection = { _id: true };

    projection.votes = { $slice: nVotes };
  }
  
  if (!projection)
    return res.json(place); 
  
  // Get additional info in the database
  Place.findById(place._id, projection, function onPlaceInfoGot(error, info) {
    if (error) return next(error);

    if (info.comments && info.comments.length !== 0)
      place.comments = info.comments;

    if (info.pictures && info.pictures.length !== 0)
      place.pictures = info.pictures;

    if (info.documents && info.documents.length !== 0)
      place.documents = info.documents;

    if (info.votes && info.votes.length !== 0)
      place.votes = info.votes;

    res.json(place);
  });
}


function createPlace(req, res, next) {
  var place = new Place(req.body);

  if (!req.body.setHeaderPhoto) {
    place.save(function onPlaceSaved(error, newPlace) {
      if (error) return next(error);

      // Remove unwanted info
      newPlace.__v = undefined;
      newPlace.comments = undefined;
      newPlace.pictures = undefined;
      newPlace.documents = undefined;
      newPlace.votes = undefined;

      res.status(201).json(newPlace);
    });
  }
  else { 
    place.validate(function onPlaceValidated(error) {
      if (error) return next(error);

      var pending = new Pending({ content: place });
      pending.save(sendUploadURL);
    });
  }

  function sendUploadURL(error, pending) {
    if (error) return next(error);

    var uploadURL = config.serverURL + '/upload/' + pending._id;
    res.redirect(204, uploadURL);

    // TODO ailleurs: gérer la requête vers ce lien de mise en ligne
    // TODO ailleurs: supprimer le Pending s’il est trop vieux
  }
}


function deletePlace(req, res, next) {
  req.place.remove(function onPlaceRemoved(error) {
    if (error) return next(error);
    res.status(204).end();
  });
}


module.exports = router;

/* vim: set ts=2 sw=2 et si colorcolumn=80 : */
