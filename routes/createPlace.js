var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();


var Checks = require('../modules/checks');
var Place = require('../models/place');

router.post('/',Checks.db,createPlace);

function createPlace(req, res, next) {
	
		var newplace = new Place(req.body);
		
		newplace.save(function(err, result) {
			if(err){
				return next(err);
			}
			console.log("The location is Inserted ");
			res.status(201);
			res.json(newplace);
		}); 
}
	
module.exports = router;
