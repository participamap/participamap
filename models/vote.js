/**
 * Model for votes
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var voteSchema = new Schema({
  place: { type: Schema.Types.ObjectId, required: true },
  author: { type: Schema.Types.ObjectId, required: true },
  date: { type: Date, default: Date.now, required: true },
  url: { type: String, required: true },
  toModerate: Boolean
});

var Vote = mongoose.model('Vote', voteSchema);

module.exports = Vote;

/* vim: set ts=2 sw=2 et si colorcolumn=80 : */
