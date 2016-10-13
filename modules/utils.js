/**
 * Utilitaries module
 */

function Utils() {
  this.returnEntity = Utils.returnEntity;
}

/**
 * Creates a callback to return an entity after a database action
 */
Utils.returnEntity = function (res, next, status=200) {
  return function (error, entity) {
    if (error) return next(error);

    entity.__v = undefined;
    res.status(status).json(entity);
  };
};

module.exports = Utils;

/* vim: set ts=2 sw=2 et si colorcolumn=80 : */
