/**
 * Participamap – A free cultural, citizen and participative mapping project.
 * Copyright (c) 2016 The Participamap Developers
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var express = require('express');
var cors = require('cors');
var RateLimit = require('express-rate-limit');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');

var Auth = require('../modules/auth');

var index = require('./api_v1/index');
var users = require('./api_v1/users');
var places = require('./api_v1/places');
var routes = require('./api_v1/routes');
var abuseReports = require('./api_v1/abuse_reports');
var upload = require('./api_v1/upload');

var config = require('../config.json');

var router = express.Router({ strict: true });

// Rate limiter
var apiLimiter = new RateLimit({
  windowMs: config.rateLimiter.windowSize * 1000,
  max: config.rateLimiter.max,
  delayMs: 0,
});

// Passport for authentication
passport.use(new LocalStrategy(Auth.verify));

// Modules
router.use(cors());
router.use(apiLimiter);
router.use(passport.initialize());
router.use(Auth.jwt);
router.use(bodyParser.json());
router.use(bodyParser.raw({ type: 'image/jpeg', limit: '5MB' }));
router.use(bodyParser.raw({ type: 'image/png', limit: '5MB' }));
router.use(bodyParser.raw({ type: 'text/plain', limit: '1MB' }));
router.use(bodyParser.raw({ type: 'application/pdf', limit: '10MB' }));
router.use(bodyParser.raw({ type: 'application/msword', limit: '5MB' }));
router.use(bodyParser.raw({ type: 'application/vnd.oasis.opendocument.text',
  limit: '5MB' }));

// Routes
router.use('/', index);
router.use('/users/', users);
router.use('/places/', places);
router.use('/routes/', routes);
router.use('/abuse-reports/', abuseReports);
router.use('/upload/', upload);

module.exports = router;

/* vim: set ts=2 sw=2 et si cc=80 : */
