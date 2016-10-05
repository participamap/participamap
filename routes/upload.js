var express = require('express');
var mongoose = require('mongoose');
var fileType = require('file-type');
var uuid = require('uuid');
var router = express.Router();

var config = require('../config.json');

var Checks = require('../modules/checks');
var PendingUpload = require('../models/pending_upload');
var FileSaver = require('../modules/filesaver');
var Place = require('../models/place');

router.param('id', Checks.isValidObjectId);
router.param('id', getPendingUpload);

router.put('/:id', Checks.db, upload);


function getPendingUpload(req, res, next, id) {
  PendingUpload.findById(id, {}, function onPendingFound(error, pendingUpload) {
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

  pendingUpload.remove(function onPendingUpdateRemoved(error) {
    if (error) return next(error);
  });

  var fileSaver = new FileSaver(config.fileUpload);

  switch (req.get('Content-Type')) {
    case 'image/jpeg':
      if (fileType(req.body).mime !== 'image/jpeg')
        return badContentType();
      
      if (!(contentType === 'place' || contentType === 'picture-info'))
        return unsupportedMediaType();
      
      var fileName = uuid.v4() + '.jpg';
      fileSaver.save(fileName, req.body, onFileSaved);
      break;

    case 'image/png':
      if (fileType(req.body).mime !== 'image/png')
        return badContentType();
      
      if (!(contentType === 'place' || contentType === 'picture-info'))
        return unsupportedMediaType();
      
      var fileName = uuid.v4() + '.png';
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

        place.save(function onPlaceSaved(error, savedPlace) {
          if (error) return next(error);
          
          savedPlace.__v = undefined;
          res.status(201).json(savedPlace);
        });

      case 'picture-info':
        var picture = pendingUpload.content.picture;
        picture.url = url;

        var onPictureAdded = function (error, savedPlace) {
          if (error) return next(error);
          res.status(201).json(savedPlace.pictures.slice(-1)[0]);
        };

        Place.findById(pendingUpload.content.place,
          function addPicture(error, place) {
            place.pictures.push(picture);
            place.save(onPictureAdded);
          });
    }
  }
}


module.exports = router;

/* vim: set ts=2 sw=2 et si colorcolumn=80 : */
