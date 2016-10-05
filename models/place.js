/**
 * Model for places
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var locationSchema = require('./schemas/location');
var commentSchema = require('./schemas/comment');
var pictureSchema = require('./schemas/picture');

var placeSchema = new Schema({
  location: {type: locationSchema, required: true },
  title: { type: String, required: true },
  isVerified: { type: Boolean, default: false, required: true },
  proposedBy: Schema.Types.ObjectId,
  type: Number, // TODO: Autre type ?
  headerPhoto: String,
  description: String,
  startDate: { type: Date, default: Date.now },
  endDate: Date,
  comments: [commentSchema],
  pictures: [pictureSchema],
  documents: [], // TODO: documentSchema
  votes: [String],
  moderateComments: Boolean,
  moderatePictures: Boolean,
  moderateDocuments: Boolean,
  denyComments: Boolean,
  denyPictures: Boolean,
  denyDocuments: Boolean
});

/**
 * Create a callback function
 */
placeSchema.statics.onSaved = function (res, next) {
  return function (error, savedPlace) {
    if (error) return next(error);

    // Remove unwanted info
    savedPlace.__v = undefined;
    savedPlace.comments = undefined;
    savedPlace.pictures = undefined;
    savedPlace.documents = undefined;
    savedPlace.votes = undefined;

    res.status(201).json(savedPlace);
  };
};

var Place = mongoose.model('Place', placeSchema);

module.exports = Place;

/* vim: set ts=2 sw=2 et si colorcolumn=80 : */
