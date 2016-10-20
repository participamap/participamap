var express = require('express');
var slash = require('express-slash');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var Supervisor = require('./modules/supervisor');
var Auth = require('./modules/auth');

var routes = require('./routes/index');
var users = require('./routes/users');
var places = require('./routes/places');
var parcours = require('./routes/parcours');
var upload = require('./routes/upload');
// TODO: Définir les statics via la config
var uploads = express.static('./uploads');

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

<<<<<<< HEAD
//utiliser passport pout auth
var passport = require('passport');
require('./config/passport');

=======
>>>>>>> e6920bb382031a5d482f9fa62a7a2cc53aa53381
// Supervisor to automate some actions
var supervisor = new Supervisor(config.supervisor);

// Passport for authentication
passport.use(new LocalStrategy(Auth.verify));

var app = express();
app.enable('strict routing');

// Module declarations
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.raw({ type: 'image/jpeg', limit: '5MB' }));
app.use(bodyParser.raw({ type: 'image/png', limit: '5MB' }));
app.use(passport.initialize());
app.use(Auth.jwt);

// Route declarations
app.use('/', routes);
<<<<<<< HEAD
app.use('/places', places);
app.use('/users', users);
app.use('/images',images);


//Route static express
app.use(express.static(path.join(__dirname,'public')));
//Initialisation du passport
app.use(passport.initialize());
app.use('/parcours', parcours);
app.use('/upload', upload);
app.use('/uploads', uploads);
=======
app.use('/users/', users);
app.use('/places/', places);
app.use('/upload/', upload);
app.use('/uploads/', uploads);
app.use(slash());
>>>>>>> e6920bb382031a5d482f9fa62a7a2cc53aa53381

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
