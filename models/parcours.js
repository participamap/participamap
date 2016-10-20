var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var parcoursSchema = new Schema({
  title: { type: String, required: true },
  places: { type: [Schema.Types.ObjectId], required: true },
});

var ParcoursSchema = mongoose.model('Parcours', parcoursSchema);

module.exports = ParcoursSchema;
