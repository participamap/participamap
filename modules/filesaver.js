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
