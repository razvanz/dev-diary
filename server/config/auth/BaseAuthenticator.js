'use strict';

var EventEmitter = require('events')
  .EventEmitter,
  debug = require('debug')('dev-diary:base_authenticator'),
  util = require('util');

function BaseAuthenticator() {
  EventEmitter.call(this);
}

util.inherits(BaseAuthenticator, EventEmitter);

BaseAuthenticator.prototype.authenticate = function (credentials, next) {
  debug('~authenticate > \ncredentials: %j', credentials);

  var authRes = new AuthenticationResult(credentials);
  this.done = next;
  this.emit('begin-auth', authRes);
};

BaseAuthenticator.prototype.broadcastValid = function (authResult) {
  debug('~valid >');

  return this.emit('finish', {
    success: true,
    user: authResult.user
  });
};

BaseAuthenticator.prototype.broadcastInvalid = function (authResult) {
  debug('~invalid > message: %s', authResult.message);

  return this.emit('finish', {
    success: false,
    message: authResult.message,
    attemptingUser: authResult.user
  });
};

BaseAuthenticator.prototype.finish = function (authResult) {
  if (this.done) {
    return this.done(null, authResult);
  }
};

BaseAuthenticator.prototype.error = function (err) {
  if (this.done) {
    return this.done(err);
  }
};

function AuthenticationResult(credentials) {
  this.message = null;
  this.credentials = credentials;
  this.user = null;
}

module.exports = BaseAuthenticator;
