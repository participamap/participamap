var express = require('express');
var mongoose = require('mongoose');

var Checks = require('../modules/checks');
var Routes = require('../models/routes');
var Utils = require('../modules/utils');

var config = require('../config.json');

var router = express.Router();

router.param('id', getRoutes);


router.get('/',Checks.db,getRoutesHeaders);
router.post('/', Checks.db, createRoutes);

router.delete('/:id', Checks.db, deleteRoutes);

function getRoutes(req, res, next, id) {
  Routes.findById(id, { __v: false }, function onRoutesFound(error, routes) {
    if (error) return next(error);

    if (!routes) {
      var err = new Error('Not Found');
      err.status = 404;
      return next(err);
    }

    req.routes = routes;

    next();
  });
}

function getRoutesHeaders(req,res,next){
	var filter = {};	
	var projection = {
		title: true,
		places: true
		
	};

	Routes.find(filter, projection,
	function returnRoutesHeaders(error, routesHeaders) {
      		if (error) return next(error);
      		res.json(routesHeaders);
    	});
}

function deleteRoutes(req, res, next) {

  var routes = req.routes;

  routes.remove(function onRoutesRemoved(error) {
    if (error) return next(error);
    res.status(204).end();
  });
}


function createRoutes(req, res, next) {
  var routes = req.routes;

  var routes = new Routes(req.body);

  var onRoutesSaved = Utils.returnSavedEntity(res, next, 201);
  routes.save(onRoutesSaved);
}



module.exports = router;
