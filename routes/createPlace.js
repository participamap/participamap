var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();


var Checks = require('../modules/checks');
var Place = require('../models/place');

router.get('/',Checks.db,createPlace);

function createPlace(req, res, next) {

	if (req.query.latitude || req.query.longitude || req.query.title || req.query.isVerified) {
		if (!(req.query.latitude && req.query.longitude && req.query.title && req.query.isVerified)){
			var err = new Error('Bad request: latitude,longitude,title,isVerrified and width must be set together');
			err.status = 400;
			return next(err);
		}
			
		var latitude = req.query.latitude;
		var longitude = req.query.longitude;
		var title = req.query.title;
		var isVerified = req.query.isVerified;
	
		var newplace = new Place({
			"location" : {
				"longitude" : longitude,
				"latitude" : latitude
			},
			"title" : title,
			"isVerified" : isVerified
		});
		
		newplace.save(function(err, result) {
			if(err){
				return next(err);
			}
			console.log("The location is Inserted ");
			res.status(201);
			res.json(newplace);
		}); 
	}
}
	
module.exports = router;
