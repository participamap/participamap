

var express = require('express');
var mongoose = require('mongoose');

var Checks = require('../modules/checks');
var Parcours = require('../models/parcours');
var Utils = require('../modules/utils');

var config = require('../config.json');

var router = express.Router();

router.param('id', getParcours);


router.get('/',Checks.db,getParcours);
router.post('/', Checks.db, createParcours);


function getParcours(req, res, next, id) {
  Place.findById(id, { __v: false }, function onPlaceFound(error, parcours) {
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
	
	var projection = {
		title: true,
		
		headerPhoto: true
	};

  Place.find(filter, projection,
    function returnPlacesHeaders(error, placesHeaders) {
      if (error) return next(error);
      res.json(placesHeaders);
    });


}

function createParcours(req, res, next) {
  var parcours = req.parcours;

  var parcours = new Parcours(req.body);

  var onParcoursSaved = Utils.returnSavedEntity(res, next, 201);
  parcours.save(onParcoursSaved);
}



module.exports = router;
