var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

var Checks = require('../modules/checks');
var Place = require('../models/place');

router.get('/', Checks.db, getPlacesHeaders);
router.get('/:id', Checks.db, getPlaceInfo);

function getPlacesHeaders(req, res, next) {
  // TODO: Filtre basé sur les paramètres de requête
  var filter = {};
  
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
