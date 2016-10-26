/**
 * Model for routes
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var routeSchema = new Schema({
  title: { type: String, required: true },
  places: { type: [Schema.Types.ObjectId], required: true },
});

var Route = mongoose.model('Route', routeSchema);

module.exports = Route;

/* vim: set ts=2 sw=2 et si cc=80 : */
