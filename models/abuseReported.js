var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var abuseReportedSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true },
  date: { type: Date, default: Date.now, required: true },
  contentReported: { type: Schema.Types.ObjectId, required: true },
  content: { type: String,enum: ["comment","document","picture"], required: true }
});

var AbuseReportedSchema = mongoose.model('Comment', abuseReportedSchema);

module.exports = AbuseReportedSchema;
