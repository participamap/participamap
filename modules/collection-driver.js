var ObjectID = require('mongodb').ObjectID;

function CollectionDriver(db) {
  this.db = db;
};

CollectionDriver.prototype.getCollection = function(callback) {
  this.db.collection(collectionName, function(error, collection) {
    if (error)
      callback(error);
    else
      callback(null, collection);
  });
};

// TODO

module.exports = CollectionDriver;

/* vim: set ts=2 sw=2 et si : */
