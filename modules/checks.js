function Checks() {
  this.db = Checks.db;
}

Checks.db = function(req, res, next) {
  if (!req.collectionDriver) {
    var err = new Error('Database Error');
    err.details = 'MongoDB is not connected';

    next(err);
    return;
  }

  next();
};

module.exports = Checks;

/* vim: set ts=2 sw=2 et si : */
