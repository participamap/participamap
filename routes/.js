var express = require('express');
var mongoose = require('mongoose');

var Checks = require('../modules/checks');

var config = require('../config.json');

var router = express.Router();
var AbuseReported = require('../models/abuseReported');



router.param('id', getPlace);


router.get('/:id', Checks.db, getAbuseReports)

router.delete('/:id', Checks.db, deleteAbuseReported)

function getPlace(req, res, next, id) {
  AbuseReported.findById(id, { __v: false }, function onPlaceFound(error, abuse) {
    if (error) return next(error);

    if (!abuse) {
      var err = new Error('Not Found');
      err.status = 404;
      return next(err);
    }

    req.abuse = abuse;
    

    next();
  });
}


function getAbuseReports(req, res, next) {
  var abuse = req.abuse;
  AbuseReported.find({ abuse: abuse._id }, { __v: false, abuse: false })
    .exec(function returnComments(error, abuse) {
      if (error) return next(error);
      res.json(abuse);
    });
  
}





function deleteAbuseReported(req, res, next) {
  var abuse = req.abuse;

  abuse.remove(function onAbuseReportedRemoved(error) {
    if (error) return next(error);
    res.status(204).end();
  });
}

module.exports = router;
