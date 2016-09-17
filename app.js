var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var routes = require('./routes/index');

var mongoURL = 'mongodb://localhost/participamap';

mongoose.connect(mongoURL);
var db = mongoose.connection;

db.on('error', function onDBConnectionError() {
  console.error('Error: impossible to connect to MongoDB. Exiting...');
  process.exit(1);
});

db.once('open', function onDBOpen() {
  console.log('Successfully connected to MongoDB!\n');
});

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes declarations
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function notFound(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function develErrorHandler(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
      error: {
        code: err.status || 500,
        message: err.message,
        err: err
      }
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function errorHandler(err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    error: {
      code: err.status || 500,
      message: err.message,
      err: {}
    }
  });
});

module.exports = app;

/* vim: set ts=2 sw=2 et si : */
