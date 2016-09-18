var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

var Checks = require('../modules/checks');
var Place = require('../models/place');

router.get('/', Checks.db, getPlacesHeaders);
router.get('/:id', Checks.db, getPlaceInfo);

function getPlacesHeaders(req, res, next) {
  var filter = {};

  if (req.query.when) {
    var date = (req.query.when === 'now')
      ? new Date()
      : new Date(req.query.when)

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

  // TODO: Filtre basé sur la position
  
  var projection = {
    location: true,
    title: true
  };

  Place.find(filter, projection, function returnPlacesHeaders(error, placeHeaders) {
    if (error) return next(error);
    res.send(placeHeaders);
  });
}

function getPlaceInfo(req, res, next) {
  // TODO: Implémenter la requête

  var err = new Error('Not Implemented');
  err.status = 501;
  next(err);
}

module.exports = router;

/* vim: set ts=2 sw=2 et si : */
