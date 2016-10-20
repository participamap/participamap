/**
 * Model for ratings
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ratingSchema = new Schema({
  place: { type: Schema.Types.ObjectId, required: true },
  user: { type: Schema.Types.ObjectId, required: true },
  value: { type: Number, required: true }
});

var Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;

/* vim: set ts=2 sw=2 et si cc=80 : */
