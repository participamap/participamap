var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var Auth = require('../modules/auth');

var index = require('./api_v1/index');
var users = require('./api_v1/users');
var places = require('./api_v1/places');
var routes = require('./api_v1/routes');
var abuseReports = require('./api_v1/abuse_reports');
var upload = require('./api_v1/upload');

var router = express.Router({ strict: true });

// Passport for authentication
passport.use(new LocalStrategy(Auth.verify));

// Modules
router.use(bodyParser.json());
router.use(bodyParser.raw({ type: 'image/jpeg', limit: '5MB' }));
router.use(bodyParser.raw({ type: 'image/png', limit: '5MB' }));
router.use(bodyParser.raw({ type: 'text/plain', limit: '1MB' }));
router.use(bodyParser.raw({ type: 'application/pdf', limit: '10MB' }));
router.use(bodyParser.raw({ type: 'application/msword', limit: '5MB' }));
router.use(bodyParser.raw({ type: 'application/vnd.oasis.opendocument.text',
  limit: '5MB' }));
router.use(passport.initialize());
router.use(Auth.jwt);

// Routes
router.use('/', index);
router.use('/users/', users);
router.use('/places/', places);
router.use('/routes/', routes);
router.use('/abuse-reports/', abuseReports);
router.use('/upload/', upload);

module.exports = router;

/* vim: set ts=2 sw=2 et si cc=80 : */
