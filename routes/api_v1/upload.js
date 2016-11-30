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
var fileType = require('file-type');
var uuid = require('uuid');

var Checks = require('../../modules/checks');
var Utils = require('../../modules/utils');

var PendingUpload = require('../../models/pending_upload');
var FileSaver = require('../../modules/filesaver');
var Place = require('../../models/place');
var Picture = require('../../models/picture');
var Document = require('../../models/document');

var config = require('../../config.json');

var router = express.Router();

router.param('id', Checks.isValidObjectId);
router.param('id', Checks.db);
router.param('id', getPendingUpload);

router.put('/:id',
  Checks.auth('user'),
  upload,
  Utils.cleanEntityToSend(['place', 'toModerate']),
  Utils.listAuthorsInObjectsToSend,
  Utils.getAuthorsInfos,
  Utils.addAuthorsNames,
  Utils.send);


function getPendingUpload(req, res, next, id) {
  PendingUpload.findById(id, {},
    function onPendingFound(error, pendingUpload) {
      if (error) return next(error);

      if (!pendingUpload) {
        var err = new Error('Not Found');
        err.status = 404;
        return next(err);
      }

      req.pendingUpload = pendingUpload;

      next();
    });
}


function upload(req, res, next) {
  var pendingUpload = req.pendingUpload;
  var contentType = pendingUpload.contentType;
  var mimeType = fileType(req.body).mime;

  pendingUpload.remove(function onPendingUpdateRemoved(error) {
    if (error) return next(error);
  });

  var fileSaver = new FileSaver(config.fileUpload);

  switch (req.get('Content-Type')) {
    case 'image/jpeg':
      if (mimeType !== 'image/jpeg')
        return badContentType();

      if (!(contentType === 'place' || contentType === 'picture'))
        return unsupportedMediaType();

      var fileName = uuid.v4() + '.jpg';
      fileSaver.save(fileName, req.body, onFileSaved);
      break;

    case 'image/png':
      if (mimeType !== 'image/png')
        return badContentType();

      if (!(contentType === 'place' || contentType === 'picture'))
        return unsupportedMediaType();

      var fileName = uuid.v4() + '.png';
      fileSaver.save(fileName, req.body, onFileSaved);
      break;

    case 'text/plain':
      if (mimeType !== 'text/plain')
        return badContentType();

      if (contentType !== 'document')
        return unsupportedMediaType();

      var fileName = uuid.v4() + '.txt';
      fileSaver.save(fileName, req.body, onFileSaved);
      break;

    case 'application/pdf':
      if (mimeType !== 'application/pdf')
        return badContentType();

      if (contentType !== 'document')
        return unsupportedMediaType();

      var fileName = uuid.v4() + '.pdf';
      fileSaver.save(fileName, req.body, onFileSaved);
      break;

    case 'application/msword':
      if (mimeType !== 'application/msword')
        return badContentType();

      if (contentType !== 'document')
        return unsupportedMediaType();

      var fileName = uuid.v4() + '.doc';
      fileSaver.save(fileName, req.body, onFileSaved);
      break;

    case 'application/vnd.oasis.opendocument.text':
      if (mimeType !== 'application/vnd.oasis.opendocument.text')
        return badContentType();

      if (contentType !== 'document')
        return unsupportedMediaType();

      var fileName = uuid.v4() + '.odt';
      fileSaver.save(fileName, req.body, onFileSaved);
      break;

    default:
      return unsupportedMediaType();
  }

  function badContentType() {
    var err = new Error('Bad Request: Content-Type does not correspond');
    err.status = 400;
    return next(err);
  }

  function unsupportedMediaType() {
    var err = new Error('Unsupported Media Type');
    err.status = 415;
    return next(err);
  }

  function onFileSaved(error, url) {
    if (error) return next(error);

    switch (contentType) {
      case 'place':
        var place = new Place(pendingUpload.content);
        place.headerPhoto = url;

        if (pendingUpload.toUpdate) {
          place.isNew = false;
          var onPlaceSaved = Utils.returnSavedEntity(req, res, next);
        }
        else {
          var onPlaceSaved = Utils.returnSavedEntity(req, res, next, 201);
        }

        place.save(onPlaceSaved);
        break;

      case 'picture':
        var picture = new Picture(pendingUpload.content);
        picture.url = url;

        var onPictureSaved = Utils.returnSavedEntity(req, res, next, 201);
        picture.save(onPictureSaved);
        break;
      
      case 'document':
        var document = new Document(pendingUpload.content);
        document.type = mimeType;
        document.url = url;

        var onDocumentSaved = Utils.returnSavedEntity(req, res, next, 201);
        document.save(onDocumentSaved);
        break;
    }
  }
}


module.exports = router;

/* vim: set ts=2 sw=2 et si cc=80 : */
