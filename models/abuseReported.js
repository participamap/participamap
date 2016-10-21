// TODO: Valider

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var abuseReportedSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true },
  date: { type: Date, default: Date.now, required: true },
  contentReported: { type: Schema.Types.ObjectId, required: true },
  type: { type: String, enum: ["comment","document","picture"], required: true }
});

var AbuseReportedSchema = mongoose.model('AbuseReported', abuseReportedSchema);

module.exports = AbuseReportedSchema;

/* vim: set ts=2 sw=2 et si cc=80 : */
