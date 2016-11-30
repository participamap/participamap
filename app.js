var express = require('express');
var slash = require('express-slash');
var logger = require('morgan');
var mongoose = require('mongoose');

var Supervisor = require('./modules/supervisor');

var api_v1 = require('./routes/api_v1');
// TODO: Définir le répertoire à servir dans la configuration
var uploads = express.static('./uploads');
var static_files = express.static('./public');

var config = require('./config.json');

// Connection to the database
mongoose.connect(config.mongodb.uri, config.mongodb.options);
var db = mongoose.connection;

db.on('error', function onDBConnectionError() {
  console.error('Error: impossible to connect to MongoDB. Exiting...');
  process.exit(1);
});

db.once('open', function onDBOpen() {
  console.log('Successfully connected to MongoDB!\n');
});

// Supervisor to automate some actions
var supervisor = new Supervisor(config.supervisor);

var app = express();
app.enable('strict routing');

// If the app runs in production mode, it is behind a reverse proxy. Trust it.
if (app.get('env') === 'production')
  app.enable('trust proxy');

// Modules
app.use(logger('dev'));

// Routes
app.use('/api/v1/', api_v1);
app.use('/uploads/', uploads);
app.use('/', static_files);
app.use(slash());

// Redirect / to the demo front-end
app.get('/', function redirectToAdmin(req, res, next) {
  res.redirect('demo/');
});

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

/* vim: set ts=2 sw=2 et si cc=80 : */
