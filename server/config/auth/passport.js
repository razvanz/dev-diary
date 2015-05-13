'use strict';

var passport = require('passport'),
  path = require('path');

module.exports = function (config) {

  // Serialize sessions
  passport.serializeUser(function (user, done) {
    return done(null, user.uid);
  });

  // Deserialize sessions
  passport.deserializeUser(function (uid, done) {
    return done(null, {
      uid: uid,
      name: 'Admin',
      username: 'admin',
      password: 'secret'
    });
  });

  // Initialize strategies
  config.getGlobbedFiles('./server/auth/strategies/**/*.js')
    .forEach(function (strategy) {
      require(path.resolve(strategy))();
    });
};
