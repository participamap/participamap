/**
 * Model for pending uploads
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pendingUploadSchema = new Schema({
  date: { type: Date, default: Date.now, required: true },
  contentType: { type: String, required: true },
  content: { type: Schema.Types.Mixed, required: true }
});

var PendingUpload = mongoose.model('PendingUpload', pendingUploadSchema);

module.exports = PendingUpload;

/* vim: set ts=2 sw=2 et si colorcolumn=80 : */
