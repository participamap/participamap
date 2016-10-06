/**
 * Utilitaries module
 */

function Utils() {
  this.returnEntity = Utils.returnEntity;
}

/**
 * Creates a callback to return an entity after saving in database
 */
Utils.returnEntity = function (res, next, status = 200) {
  return function (error, entity) {
    if (error) return next(error);

    // Remove unwanted info
    entity.__v = undefined;
    entity.place = undefined;

    res.status(status).json(entity);
  };
};

module.exports = Utils;

/* vim: set ts=2 sw=2 et si colorcolumn=80 : */
