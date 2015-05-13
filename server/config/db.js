'use strict';

function Database() {}

Database.prototype.connect = function (config, cb) {
  return cb();
};

Database.prototype.disconnect = function (cb) {
  return cb();
};

module.exports = new Database();
