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
 * Supervisor module
 */

var mongoose = require('mongoose');

var PendingUpload = require('../models/pending_upload');

function Supervisor(config) {
  /**
   * Clean outdated pending uploads
   */
  cleanPendingUploads = function () {
    var now = new Date();
    var minDate = new Date(now);
    minDate.setSeconds(now.getSeconds() + config.pendingUploadsValidity);

    var condition = { date: { $lt: minDate } };

    PendingUpload.remove(condition, function onPendingUploadsRemoved(error) {
      if (error) console.log(error);
    });
  };

  setInterval(cleanPendingUploads, config.pendingUploadsValidity * 1000);
}

module.exports = Supervisor;

/* vim: set ts=2 sw=2 et si cc=80 : */
