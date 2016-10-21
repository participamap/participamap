// TODO: Valider + nommage

var express = require('express');
var mongoose = require('mongoose');

var Checks = require('../modules/checks');

var config = require('../config.json');

var Abuse = require('../models/abuse');
var Comment = require('../models/comment');
var Document = require('../models/document');
var Picture = require('../models/picture');

var router = express.Router();

router.param('id', getAbuse);
router.param('contentReport_id', Checks.isValidObjectId);

router.get('/', Checks.db, getAbuseReport);
router.delete('/deleteContentReport/:id', Checks.db, deleteContentReport)
router.delete('/:id', Checks.db, deleteAbuseReported)


function getAbuseReport(req, res, next) {
	var filter={};
	var projection = {
		_id:true,
		user: true,
		date: true,
		contentReported:true,
		type: true
	};
	Abuse.find(filter, projection,
		function returnAbuseHeaders(error, abusereport) {
			if (error) return next(error);
			res.json(abusereport);
	});
}

function getAbuse(req, res, next, id) {
	Abuse.findById(id, { __v: false }, function onPlaceFound(error, abuse) {
		if (error) return next(error);

		if (!abuse){
			console.log("toto");
			var err = new Error('Not Found');
			err.status = 404;
			return next(err);
		}

		req.abuse = abuse;

		next();
	});
}

function deleteContentReport(req, res, next) {
	var abuse = req.abuse;
	var type = req.abuse.type;
	var contentReported=req.abuse.contentReported;
	//res.send(type)
	switch (type){
		case "comment":
			Comment.remove({ _id: contentReported }, onRemoved); 
			
		
		case "picture":
			Picture.remove({ _id: contentReported }, onRemoved);
			
			
		case "document":
			Document.remove({ _id: contentReported }, onRemoved);
		
	}
	function onRemoved(error) {
		if (error) return next(error);
	}
	
}

function deleteAbuseReported(req, res, next) {
  var abuse = req.abuse;

  abuse.remove(function onAbuseReportedRemoved(error) {
    if (error) return next(error);
    res.status(204).end();
  });
}

module.exports = router;

/* vim: set ts=2 sw=2 et si cc=80 : */
