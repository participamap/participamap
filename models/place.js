/**
 * Participamap – A free cultural, citizen and participative mapping project.
 * Copyright (c) 2016 The Participamap Developers
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


/**
 * Model for places
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var locationSchema = require('./schemas/location');

var placeSchema = new Schema({
  location: {type: locationSchema, required: true },
  title: { type: String, required: true },
  isVerified: { type: Boolean, default: false, required: true },
  proposedBy: Schema.Types.ObjectId,
  type: Number, // TODO: Autre type ?
  headerPhoto: String,
  description: String,
  startDate: { type: Date, default: Date.now },
  endDate: Date,
  rating: Number,
  moderateComments: Boolean,
  moderatePictures: Boolean,
  moderateDocuments: Boolean,
  denyComments: Boolean,
  denyPictures: Boolean,
  denyDocuments: Boolean,
  generic1: Schema.Types.Mixed,
  generic2: Schema.Types.Mixed,
  generic3: Schema.Types.Mixed,
  generic4: Schema.Types.Mixed,
  generic5: Schema.Types.Mixed
});

var Place = mongoose.model('Place', placeSchema);

module.exports = Place;

/* vim: set ts=2 sw=2 et si cc=80 : */
