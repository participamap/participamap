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
 * File saver module
 */

var fs = require('fs');
var path = require('path');
var url = require('url');

function FileSaver(config) {
  switch (config.method) {
    case 'local':
      /**
       * Save the file locally
       *
       * options:
       *   - uploadDir: directory where the files are uploaded
       *   - fileServerURL: URL to access the files remotely
       */
      this.save = function (fileName, content, callback) {
        var filePath = path.join(config.options.uploadDir, fileName);

        fs.writeFile(filePath, content, function onFileSaved(error) {
          if (error) return callback(error);

          var fileURL = url.resolve(config.options.fileServerURL, fileName);
          callback(null, fileURL);
        });
      };
      break;

    default:
      var err = new Error('FileSaver: Unknown method ' + config.method);
      throw err;
  }
}

module.exports = FileSaver;

/* vim: set ts=2 sw=2 et si cc=80 : */
