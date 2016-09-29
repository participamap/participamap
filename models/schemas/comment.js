/**
 * Comment schema
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
  author: { type: Schema.Types.ObjectId, required: true },
  date: { type: Date, default: Date.now, required: true },
  content: { type: String, required: true }
});

module.exports = commentSchema;

/* vim: set ts=2 sw=2 et si colorcolumn=80 : */
