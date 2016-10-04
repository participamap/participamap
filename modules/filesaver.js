/**
 * File saver module
 */

var fs = require('fs');

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
        var filePath = config.options.uploadDir + fileName;
        
        fs.writeFile(filePath, content, function onFileSaved(error) {
          if (error) return callback(error);

          var fileURL = config.options.fileServerURL + fileName;
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

/* vim: set ts=2 sw=2 et si colorcolumn=80 : */
