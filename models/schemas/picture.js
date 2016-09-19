/**
 * Picture schema
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pictureSchema = new Schema({
  author: { type: Schema.Types.ObjectId, required: true },
  date: { type: Date, default: Date.now, required: true },
  link: { type: String, required: true }
});

module.exports = pictureSchema;

/* vim: set ts=2 sw=2 et si : */
