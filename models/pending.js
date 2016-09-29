/**
 * Model for pendings
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pendingSchema = new Schema({
  content: { type: Schema.Types.Mixed, required: true },
  date: { type: Date, default: Date.now, required: true }
});

var Pending = mongoose.model('Pending', pendingSchema);

module.exports = Pending;

/* vim: set ts=2 sw=2 et si colorcolumn=80 : */
