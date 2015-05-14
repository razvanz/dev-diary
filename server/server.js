'use strict';

var EventEmitter = require('events')
  .EventEmitter,
  colors = require('colors'),
  debug = require('debug')('server'),
  util = require('util');

var config = require('./config/config'),
  db = require('./config/db'),
  expressConf = require('./config/express');

util.inherits(Server, EventEmitter);

function Server() {
  EventEmitter.call(this);

  this._server = null;

  this.on('configure', this.configure);
  this.on('start', this.start);
  this.on('shutdown', this.shutdown);
  this.on('db-connect', this.connectDB);
  this.on('db-disconnect', this.disconnectDB);

  this.on('error', this.handleError);
}

Server.prototype.configure = function () {
  var self = this;

  return config.init(function (err, config) {
    if (err)
      return self.emit('error', err);
    else {
      debug('server configured!');
      return self.emit('configured', config);
    }
  });
};

Server.prototype.start = function (config) {
  this._server = expressConf(config)
    .listen(config.port);

  console.log('--');
  console.log(colors.bgGreen('Server started!'));
  console.log(colors.green('Environment:\t\t\t' + process.env.NODE_ENV));
  console.log(colors.green('Port:\t\t\t\t' + config.port));
  console.log('--');
};

Server.prototype.shutdown = function (code) {
  process.exit(code);
};

Server.prototype.connectDB = function (config) {
  var self = this;

  return db.connect(config.db, function (err) {
    if (err)
      return self.emit('error', err);
    else
      return self.emit('db-connected');
  });
};

Server.prototype.disconnectDB = function () {
  var self = this;

  return db.disconnect(function (err) {
    if (err)
      return self.emit('error', err);
    else
      return self.emit('db-disconnected');
  });
};

Server.prototype.handleError = function (err) {
  debug(colors.red('\n' + err));
  return this.emit('shutdown', 1);
};

module.exports = new Server();

process.on('exit', function () {
  console.log('\n');
  console.log(colors.bgRed('Server shutting down ...'));
});
