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
