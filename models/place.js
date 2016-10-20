/**
 * Model for places
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var locationSchema = require('./schemas/location');
<<<<<<< HEAD
//var commentSchema = require('./schemas/comment');
//var pictureSchema = require('./schemas/picture');
=======
>>>>>>> e6920bb382031a5d482f9fa62a7a2cc53aa53381

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
  moderateComments: Boolean,
  moderatePictures: Boolean,
  moderateDocuments: Boolean,
  denyComments: Boolean,
  denyPictures: Boolean,
  denyDocuments: Boolean,
  generic1: Schema.Types.Mixed,
  generic2: Schema.Types.Mixed,
  generic3: Schema.Types.Mixed,
  generic4: Schema.Types.Mixed,
  generic5: Schema.Types.Mixed
});

var Place = mongoose.model('Place', placeSchema);

module.exports = Place;

/* vim: set ts=2 sw=2 et si cc=80 : */
