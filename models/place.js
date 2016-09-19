/**
 * Model for places
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var locationSchema = require('./schemas/location');
var commentSchema = require('./schemas/comment');

var placeSchema = new Schema({
  location: {type: locationSchema, required: true },
  title: { type: String, required: true },
  isVerified: { type: Boolean, default: false, required: true },
  type: Number, // TODO: Autre type ?
  description: String,
  comments: [commentSchema],
  // TODO: pictures
  // TODO: documents
  // TODO: votes
  manager: Schema.Types.ObjectId,
  startDate: { type: Date, default: Date.now },
  endDate: Date,
  moderateComments: Boolean,
  moderatePictures: Boolean,
  moderateDocuments: Boolean,
  denyComments: Boolean,
  denyPictures: Boolean,
  denyDocuments: Boolean
});

var Place = mongoose.model('Place', placeSchema);

module.exports = Place;

/* vim: set ts=2 sw=2 et si : */
