var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var routesSchema = new Schema({
  title: { type: String, required: true },
  places: { type: [Schema.Types.ObjectId], required: true },
});

var RoutesSchema = mongoose.model('Routes', routesSchema);

module.exports = RoutesSchema;
