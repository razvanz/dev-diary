'use strict';

var BaseAuthenticator = require('../BaseAuthenticator'),
  LocalStrategy = require('passport-local')
  .Strategy,
  passport = require('passport'),
  util = require('util');

// var userModel = require('../models/user');

module.exports = function () {
  passport.use(new LocalStrategy({
    passReqToCallback: true
  }, function (req, username, password, done) {

    new Authenticator()
      .authenticate({
        'username': username,
        'password': password,
        'remoteAddr': req.ip
      }, function (err, result) {
        if (err) {
          return done(err);
        } else if (!result.success) {
          return done(null, false, {
            message: result.message,
            attemptingUser: result.attemptingUser
          });
        } else {
          return done(null, result.user);
        }
      });
  }));
};

/*************************************************
 * AUTHENTICATOR
 *************************************************/

function Authenticator() {
  BaseAuthenticator.call(this);

  this.done = function () {};

  this.on('begin-auth', this.validateCredentials);
  this.on('valid-credentials', this.findUser);
  this.on('user-found', this.validatePassword);

  this.on('valid', this.broadcastValid);
  this.on('invalid', this.broadcastInvalid);

  this.on('finish', this.finish);
  this.on('error', this.error);
}

util.inherits(Authenticator, BaseAuthenticator);

Authenticator.prototype.validateCredentials = function (authResult) {
  if (authResult.credentials.username && authResult.credentials.password) {
    return this.emit('valid-credentials', authResult);
  } else if (!authResult.credentials.username) {
    authResult.message = 'Username is wrong or missing.';
  } else {
    authResult.message = 'Password is missing.';
  }
  return this.emit('invalid', authResult);
};

Authenticator.prototype.findUser = function (authResult) {
  var self = this;

  // return userModel.searchOne({
  //   username: authResult.credentials.username
  // }, function (err, user) {
  //   if (err) {
  //     return self.emit('error', err);
  //   } else if (!user) {
  //     authResult.message = 'Invalid credentials.';
  //     return self.emit('invalid', authResult);
  //   } else {
  //     authResult.user = user;
  //     return self.emit('user-found', authResult);
  //   }
  // });

  authResult.user = {
    uid: '1',
    name: 'Admin',
    password: 'secret'
  };

  return self.emit('user-found', authResult);
};

Authenticator.prototype.validatePassword = function (authResult) {
  // if (userModel.hashPassword(authResult.credentials.password,
  //     authResult.user.salt) === authResult.user.passwordhash) {
  //   return this.emit('valid', authResult);
  // } else {
  //   authResult.message = 'Invalid credentials.';
  //   return this.emit('invalid', authResult);
  // }

  return this.emit('valid', authResult);
};

module.exports.Authenticator = Authenticator;
