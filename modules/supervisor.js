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
    minDate.setSeconds(now.getSeconds() + 1000); //config.pendingUploadsValidity

    var condition = { date: { $lt: minDate } };

    PendingUpload.remove(condition, function onPendingUploadsRemoved(error) {
      if (error) console.log(error);
    });
  };
  
  setInterval(cleanPendingUploads,1000 ); //config.pendingUploadsValidity
}

module.exports = Supervisor;

/* vim: set ts=2 sw=2 et si colorcolumn=80 : */
