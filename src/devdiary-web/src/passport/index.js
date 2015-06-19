'use strict';

var passport = require('passport'),
  LocalStrategy = require('passport-local')
  .Strategy;

module.exports = function (seneca) {
  // Serialize sessions
  passport.serializeUser(function (user, done) {
    return done(null, user.username);
  });

  // Deserialize sessions
  passport.deserializeUser(function (username, done) {

    return seneca.act({
      role: 'auth',
      cmd: 'deserialize',

      data: {
        username: username
      }
    }, done);
  });

  // Local Strategy
  passport.use(new LocalStrategy({
    passReqToCallback: true
  }, function (req, username, password, done) {
    return seneca.act({
      role: 'auth',
      cmd: 'login',

      data: {
        username: username,
        password: password
      }
    }, function (err, result) {
      if (err)
        return done(err);
      else if (!result.success)
        return done(null, false, {
          message: result.message
        });
      else
        return done(null, result.user);
    });
  }));
};
