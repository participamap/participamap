// TODO: Valider

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var abuseReportedSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true },
  date: { type: Date, default: Date.now, required: true },
  contentReported: { type: Schema.Types.ObjectId, required: true },
  type: { type: String, enum: ["comment","document","picture"], required: true }
});

var Abuse = mongoose.model('Abuse', abuseReportedSchema);

module.exports = Abuse;

/* vim: set ts=2 sw=2 et si cc=80 : */
