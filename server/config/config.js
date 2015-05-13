'use strict';

var _ = require('lodash'),
  async = require('async'),
  glob = require('glob'),
  debug = require('debug')('dev-diary:config');

function Config() {
  _.assign(this, require('./env/all'));
}

Config.prototype.init = function (cb) {
  var self = this;

  self.initEnv(function (err) {
    if (err)
      return cb(err);
    else {
      _.assign(self, require('./env/' + process.env.NODE_ENV) || {});
      return cb(null, self);
    }
  });
};

Config.prototype.initEnv = function (cb) {
  /**
   * We'll Look for a valid NODE_ENV variable and
   * if one cannot be found load the development NODE_ENV
   */

  glob('./server/config/env/' + process.env.NODE_ENV + '.js',
    function (err, files) {
      if (err)
        return cb(err);
      else if (!files || files.length === 0) {

        if (process.env.NODE_ENV) {
          debug('No configuration file found for "%s" environment!'.bgYellow,
            process.env.NODE_ENV);
        } else {
          debug('NODE_ENV is not defined!'.bgYellow);
        }

        process.env.NODE_ENV = 'development';

      }

      debug('Using "%s" environment'.bgGreen, process.env.NODE_ENV);
      return cb();
    });
};

Config.prototype.getGlobbedFiles = function (patterns, removeRoot, cb) {
  var sync = false;

  if ('function' === typeof removeRoot) {
    cb = removeRoot;
    removeRoot = false;
  }

  if ('function' !== typeof cb) {
    sync = true;
  }

  if (sync) {
    return this.getGlobbedFilesSync(patterns, removeRoot);
  } else {
    return this.getGlobbedFilesAsync(patterns, removeRoot, cb);
  }
};

Config.prototype.getGlobbedFilesSync = function (patterns, removeRoot) {
  var result = [];

  if (!(patterns instanceof Array)) {
    patterns = [patterns];
  }

  patterns = _.flattenDeep(patterns);

  for (var i = patterns.length - 1; i >= 0; i--) {
    result = _.union(result, this.spliceFromPaths(glob.sync(patterns[i], {
      sync: true
    }), removeRoot));
  }

  return result;
};

Config.prototype.getGlobbedFilesAsync = function (patterns, removeRoot, cb) {
  if ('function' === typeof removeRoot) {
    cb = removeRoot;
    removeRoot = false;
  }

  if (!(patterns instanceof Array)) {
    patterns = [patterns];
  }

  patterns = _.flattenDeep(patterns);

  var self = this;

  return async.eachSeries(patterns, function (pattern, done) {
    return glob(patterns, function (err, files) {
      if (err)
        return done(err);
      else
        return self.spliceFromPaths(files, removeRoot);
    });
  }, function (err, paths) {
    if (err)
      return cb(err);
    else
      return cb(null, _.flattenDeep(paths));
  });
};

Config.prototype.spliceFromPaths = function (paths, splice) {
  if (!splice)
    return paths;
  else
    return paths.map(function (path) {
      return path.replace(splice, '');
    });
};

Config.prototype.getJS = function () {
  return this.getGlobbedFiles(_.union(this.assets.lib.js,
    this.assets.js), this.jsRoot);
};

Config.prototype.getCSS = function () {
  return this.getGlobbedFiles(_.union(this.assets.lib.css,
    this.assets.css), this.cssRoot);
};

module.exports = new Config();
