/**
 * Model for documents
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var documentSchema = new Schema({
  place: { type: Schema.Types.ObjectId, required: true },
  author: { type: Schema.Types.ObjectId, required: true },
  date: { type: Date, default: Date.now, required: true },
  type: { type: String, required: true }
  url: { type: String, required: true }
});

var Document = mongoose.model('Document', documentSchema);

module.exports = Document;

/* vim: set ts=2 sw=2 et si colorcolumn=80 : */
