var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');

// TODO: Rendre ça plus propre, pas d’import en global
require('./config/passport');
require('./models/users');
require('./models/place');

var config = require('./config.json');

var Supervisor = require('./modules/supervisor');

var routes = require('./routes/index');
var places = require('./routes/places');
var upload = require('./routes/upload');
// TODO: Définir les statics via la config
var uploads = express.static('./uploads');

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

// Modules declarations
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.raw({ type: 'image/jpeg', limit: '5MB' }));
app.use(bodyParser.raw({ type: 'image/png', limit: '5MB' }));
app.use(passport.initialize());

// Routes declarations
app.use('/', routes);
app.use('/places', places);
app.use('/users', users);
app.use('/upload', upload);
app.use('/uploads', uploads);

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

/* vim: set ts=2 sw=2 et si colorcolumn=80 : */
