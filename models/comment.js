/**
 * Model for comments
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
  place: { type: Schema.Types.ObjectId, required: true },
  author: { type: Schema.Types.ObjectId, required: true },
  date: { type: Date, default: Date.now, required: true },
  content: { type: String, required: true },
  toModerate: Boolean
});

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;

/* vim: set ts=2 sw=2 et si colorcolumn=80 : */
