/**
 * Participamap – A free cultural, citizen and participative mapping project.
 * Copyright (c) 2016 The Participamap Developers
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var express = require('express');
var mongoose = require('mongoose');

var Checks = require('../../modules/checks');
var Utils = require('../../modules/utils');

var AbuseReport = require('../../models/abuse_report');
var Place = require('../../models/place');
var Comment = require('../../models/comment');
var Picture = require('../../models/picture');
var Document = require('../../models/document');

var ObjectId = mongoose.Types.ObjectId;

var router = express.Router({ strict: true });

router.param('id', Checks.isValidObjectId);
router.param('id', Checks.db);
router.param('id', getAbuseReport);

// getAbuseReports
router.get('/',
  Checks.auth('moderator'),
  Checks.db,
  getAbuseReports,
  Utils.listAuthorsInObjectsToSend,
  Utils.getAuthorsInfos,
  Utils.addAuthorsNames,
  Utils.listReportedContentsInObjectsToSend,
  Utils.getObjects,
  Utils.replaceByObjects,
  Utils.send);

// deleteAbuseReport
router.delete('/:id',
  Checks.auth('moderator'),
  deleteAbuseReport);

// deleteAbusiveContent
router.post('/:id/delete-content',
  Checks.auth('moderator'),
  deleteAbusiveContent);


function getAbuseReport(req, res, next, id) {
  AbuseReport.findById(id, { __v: false },
    function onAbuseReportFound(error, abuseReport) {
      if (error) return next(error);

      if (!abuseReport) {
        var err = new Error('Not Found');
        err.status = 404;
        return next(err);
      }

      req.abuseReport = abuseReport;

      next();
    });
}


function getAbuseReports(req, res, next) {
  var page = 1;
  var n = 0;

  if (req.query.page) {
    page = parseInt(req.query.page)

    if (isNaN(page)) {
      var err = new Error('Bad Request: page must be an integer');
      err.status = 400;
      return next(err);
    }

    if (page <= 0) {
      var err = new Error('Bad Request: page must be strictly positive');
      err.status = 400;
      return next(err);
    }

    n = 25;
  }

  if (req.query.n) {
    n = parseInt(req.query.n);

    if (isNaN(n)) {
      var err = new Error('Bad Request: n must be an integer');
      err.status = 400;
      return next(err);
    }

    if (n <= 0) {
      var err = new Error('Bad Request: n must be strictly positive');
      err.status = 400;
      return next(err);
    }
  }

  AbuseReport.find({}, { __v: false })
    .sort('date')
    .skip((page - 1) * n)
    .limit(n)
    .lean()
    .exec(function returnAbuseReports(error, abuseReports) {
      if (error) return next(error);

      req.toSend = abuseReports;
      next();
    });
}


function deleteAbuseReport(req, res, next) {
  var abuseReport = req.abuseReport;

  abuseReport.remove(function onAbuseReportRemoved(error) {
    if (error) return next(error);
    res.status(204).end();
  });
}


function deleteAbusiveContent(req, res, next) {
  var abuseReport = req.abuseReport;
  var reportedContent = abuseReport.reportedContent;

  switch (abuseReport.type) {
    case 'place':
      Place.remove({ _id: reportedContent }, onAbusiveContentRemoved);
      break;

    case 'comment':
      Comment.remove({ _id: reportedContent }, onAbusiveContentRemoved);
      break;

    case 'picture':
      Picture.remove({ _id: reportedContent }, onAbusiveContentRemoved);
      break;

    case 'document':
      Document.remove({ _id: reportedContent }, onAbusiveContentRemoved);
      break;
  }

  function onAbusiveContentRemoved(error) {
    if (error) return next(error);
    abuseReport.remove(onAbuseReportRemoved);
  }

  function onAbuseReportRemoved(error) {
    if (error) return next(error);
    res.status(204).end();
  }
}

module.exports = router;

/* vim: set ts=2 sw=2 et si cc=80 : */
