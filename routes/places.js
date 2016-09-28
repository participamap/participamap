var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

var Checks = require('../modules/checks');
var Place = require('../models/place');

router.param('id', Checks.isValidObjectId);
router.param('id', getPlace);

router.get('/', Checks.db, getPlacesHeaders);
router.get('/:id', Checks.db, getPlaceInfo);
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
    description: true,
    startDate: true,
    endDate: true,
    manager: true,
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
    if (!(req.query.lat && req.query.long && req.query.height && req.query.width)) {
      var err = new Error('Bad request: lat, long, height and width must be set together');
      err.status = 400;
      return next(err);
    }

    var latitude = parseFloat(req.query.lat);
    var longitude = parseFloat(req.query.long);
    var height = parseFloat(req.query.height);
    var width = parseFloat(req.query.width);

    if (isNaN(latitude) || isNaN(longitude) || isNaN(height) || isNaN(width)) {
      var err = new Error('Bad request: lat, long, height and width must be numbers');
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
    title: true
  };

  Place.find(filter, projection, function returnPlacesHeaders(error, placesHeaders) {
    if (error) return next(error);
    res.json(placesHeaders);
  });
}


function getPlaceInfo(req, res, next) {
  place = req.place;
  
  if (!req.query.admin) {
    delete place.proposedBy;
    delete place.manager;
    delete place.moderateComments;
    delete place.moderateDocuments;
    delete place.moderatePictures; 
  }
  
  res.json(place); 
}


function createPlace(req, res, next) {
  var place = new Place(req.body);

  place.save(function onPlaceSaved(error, newPlace) {
    if(error) return next(error);
    res.status(201).json(newPlace);
  }); 
}


function deletePlace(req, res, next) {
  req.place.remove(function onPlaceRemoved(error) {
    if (error) return next(error);
    res.status(204).end();
  });
}


module.exports = router;

/* vim: set ts=2 sw=2 et si : */
