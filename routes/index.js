var express = require('express');
var router = express.Router();

// Get the service descriptor
router.get('/', function getRoot(req, res, next) {
  res.send({});
});

module.exports = router;

/* vim: set ts=2 sw=2 et si colorcolumn=80 : */
