var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var CollectionDriver = require('./modules/collection-driver');

var routes = require('./routes/index');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var mongoURL = 'mongodb://localhost:27017/participamap';
var collectionDriver;

MongoClient.connect(mongoURL, function(err, db) {
  if (err) {
    console.error('Error: impossible to connect to MongoDB. Exiting...');
    process.exit(1);
  }

  collectionDriver = new CollectionDriver(db);
  console.log('Successfully connected to MongoDB!\n');
});

// Add the collection driver to each request
app.use(function(req, res, next) {
  req.collectionDriver = collectionDriver;
  next();
});

// Routes declarations
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
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
app.use(function(err, req, res, next) {
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
