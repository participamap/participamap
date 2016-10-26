var express = require('express');
var mongoose = require('mongoose');

var Checks = require('../modules/checks');
var Utils = require('../modules/utils');

var Route = require('../models/route');

var ObjectId = mongoose.Types.ObjectId;

var router = express.Router({ strict: true });

router.param('id', Checks.isValidObjectId);
router.param('id', getRoute);

router.param('index', parseIndex);

// getRoutesHeaders
router.get('/',
  Checks.db,
  getRoutesHeaders);

// getRouteInfo
router.get('/:id',
  getRouteInfo);

// createRoute
router.post('/',
  Checks.auth('content-owner'),
  Checks.db,
  createRoute,
  Utils.cleanEntityToSend(),
  Utils.send);

// updateRoute
router.put('/:id',
  Checks.auth('content-owner'),
  updateRoute,
  Utils.cleanEntityToSend(),
  Utils.send);

// addPlace
router.post('/:id/',
  Checks.auth('content-owner'),
  addPlace,
  Utils.cleanEntityToSend(),
  Utils.send);

// removePlace
router.delete('/:id/:index',
  Checks.auth('content-owner'),
  removePlace,
  Utils.cleanEntityToSend(),
  Utils.send);

// deleteRoute
router.delete('/:id',
  Checks.auth('content-owner'),
  deleteRoute);


function getRoute(req, res, next, id) {
  Route.findById(id, { __v: false }, function onRouteFound(error, route) {
    if (error) return next(error);

    if (!route) {
      var err = new Error('Not Found');
      err.status = 404;
      return next(err);
    }

    req.placesRoute = route;

    next();
  });
}


function parseIndex(req, res, next, index) {
  var i = parseInt(index);

  if (isNaN(i)) {
    var err = new Error('Bad Request: The index must be an integer');
    err.status = 400;
    return next(err);
  }

  if (i < 0) {
    var err = new Error('Bad Request: The index must be positive');
    err.status = 400;
    return next(err);
  }

  req.index = i;

  next();
}


function getRoutesHeaders(req, res, next) {
  var filter = {};

  if (req.query.place) {
    if (!ObjectId.isValid(req.query.place)) {
      var err = new Error('Bad Request: place must be a valid ObjectId');
      err.status = 400;
      return next(err);
    }

    filter.places = req.query.place;
  }

  var projection = {
    title: true
  };

  Route.find(filter, projection,
    function returnRoutesHeaders(error, routesHeaders) {
      if (error) return next(error);
      res.json(routesHeaders);
    });
}


function getRouteInfo(req, res, next) {
  res.json(req.placesRoute);
}


function createRoute(req, res, next) {
  var route = new Route({
    title: req.body.title,
    places: req.body.places
  });

  // TODO: Un lieu doit exister pour être dans un parcours

  var onRouteSaved = Utils.returnSavedEntity(req, res, next, 201);
  route.save(onRouteSaved);
}


function updateRoute(req, res, next) {
  var route = req.placesRoute;
  var modifications = req.body;

  // Delete unchangeable attributes
  delete modifications._id;
  delete modifications.__v;

  // TODO: Un lieu doit exister pour être dans un parcours

  for (attribute in modifications)
    route[attribute] = modifications[attribute];

  var onRouteSaved = Utils.returnSavedEntity(req, res, next);
  route.save(onRouteSaved);
}


function addPlace(req, res, next) {
  var route = req.placesRoute;

  if (!req.body.place) {
    var err = new Error('Bad Request: A place must be provided in the request '
      + 'content');
    err.status = 400;
    return next(err);
  }

  var place = req.body.place;

  if (!ObjectId.isValid(place)) {
    var err = new Error('Bad Request: place must be a valid ObjectId');
    err.status = 400;
    return next(err);
  }

  // TODO: Un lieu doit exister pour être dans un parcours

  route.places.push(place);

  var onRouteSaved = Utils.returnSavedEntity(req, res, next);
  route.save(onRouteSaved);
}


function removePlace(req, res, next) {
  var route = req.placesRoute;
  var i = req.index;

  if (i >= route.places.length) {
    var err = new Error('Bad Request: Index out of range');
    err.status = 400;
    return next(err);
  }

  route.places.splice(i, 1);

  var onRouteSaved = Utils.returnSavedEntity(req, res, next);
  route.save(onRouteSaved);
}


function deleteRoute(req, res, next) {
  var route = req.placesRoute;

  route.remove(function onRouteRemoved(error) {
    if (error) return next(error);
    res.status(204).end();
  });
}


module.exports = router;

/* vim: set ts=2 sw=2 et si cc=80 : */
