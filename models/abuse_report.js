/**
 * Model for abuse reports
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var abuseReportSchema = new Schema({
  author: { type: Schema.Types.ObjectId, required: true },
  date: { type: Date, default: Date.now, required: true },
  type: {
    type: String,
    enum: ['place', 'comment', 'picture', 'document'],
    required: true
  },
  reportedContent: { type: Schema.Types.ObjectId, required: true }
});

var AbuseReport = mongoose.model('AbuseReport', abuseReportSchema);

module.exports = AbuseReport;

/* vim: set ts=2 sw=2 et si cc=80 : */
