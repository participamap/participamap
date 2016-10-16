/**
 * Model for AbusREport
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AbuseReportSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true },
  date: { type: Date, default: Date.now, required: true },
  contentReporte: { type: Schema.Types.ObjectId, required: true },
  type: { type: String, required: true }
});

var AbuseReports = mongoose.model('AbuseReports', AbuseReportSchema);

module.exports = AbuseReport;

/* vim: set ts=2 sw=2 et si colorcolumn=80 : */
