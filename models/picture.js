/**
 * Model for pictures
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pictureSchema = new Schema({
  place: { type: Schema.Types.ObjectId, required: true },
  author: { type: Schema.Types.ObjectId, required: true },
  date: { type: Date, default: Date.now, required: true },
  url: { type: String, required: true },
  toModerate: Boolean
});

var Picture = mongoose.model('Picture', pictureSchema);

module.exports = Picture;

/* vim: set ts=2 sw=2 et si cc=80 : */
