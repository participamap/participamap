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
 * Model for pending uploads
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pendingUploadSchema = new Schema({
  date: { type: Date, default: Date.now, required: true },
  contentType: { type: String, required: true },
  content: { type: Schema.Types.Mixed, required: true },
  toUpdate: { type: Boolean, default: false }
});

var PendingUpload = mongoose.model('PendingUpload', pendingUploadSchema);

module.exports = PendingUpload;

/* vim: set ts=2 sw=2 et si cc=80 : */
