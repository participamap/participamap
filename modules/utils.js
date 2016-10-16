/**
 * Utilitaries module
 */

function Utils() {
  this.returnSavedEntity = Utils.returnSavedEntity;
}

/**
 * Creates a callback to return an entity after saving it in the database
 */
Utils.returnSavedEntity = function (res, next) {
  return function (error, savedEntity) {
    if (error) return next(error);

    // Remove unwanted info
    savedEntity.__v = undefined;
    savedEntity.place = undefined;

    res.status(status).json(savedEntity);
  };
};

module.exports = Utils;

/* vim: set ts=2 sw=2 et si colorcolumn=80 : */
