var express = require('express');
var mongoose = require('mongoose');

var Checks = require('../modules/checks');
var Parcours = require('../models/parcours');
var Utils = require('../modules/utils');

var config = require('../config.json');

var router = express.Router();

router.param('id', getParcours);


router.get('/',Checks.db,getParcoursHeaders);
router.post('/', Checks.db, createParcours);

router.delete('/:id', Checks.db, deleteParcours);

function getParcours(req, res, next, id) {
  Parcours.findById(id, { __v: false }, function onParcoursFound(error, parcours) {
    if (error) return next(error);

    if (!parcours) {
      var err = new Error('Not Found');
      err.status = 404;
      return next(err);
    }

    req.parcours = parcours;

    next();
  });
}

function getParcoursHeaders(req,res,next){
	var filter = {};	
	var projection = {
		title: true,
		places: true
		
	};

	Parcours.find(filter, projection,
	function returnParcoursHeaders(error, parcoursHeaders) {
      		if (error) return next(error);
      		res.json(parcoursHeaders);
    	});
}

function deleteParcours(req, res, next) {

  var parcours = req.parcours;

  parcours.remove(function onParcoursRemoved(error) {
    if (error) return next(error);
    res.status(204).end();
  });
}


function createParcours(req, res, next) {
  var parcours = req.parcours;

  var parcours = new Parcours(req.body);

  var onParcoursSaved = Utils.returnSavedEntity(res, next, 201);
  parcours.save(onParcoursSaved);
}



module.exports = router;
