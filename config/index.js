'use strict';

var _ = require('lodash'),
  async = require('async'),
  glob = require('glob'),
  debug = require('debug')('dev-diary:config');

function Config() {
  _.assign(this, require('./env/all'));
}

Config.prototype.init = function () {
  return _.assign(this, this._getEnvConf());
};

Config.prototype._getEnvConf = function () {
  /**
   * We'll Look for a valid NODE_ENV variable and
   * if one cannot be found load the development NODE_ENV
   */
  var pattern = './**/config/env/' + process.env.NODE_ENV + '.js',
    config = {};

  var filePath = this.getGlobbedFilesSync(pattern);

  if (!filePath || filePath.length === 0) {
    if (process.env.NODE_ENV) {
      debug('No configuration file found for "%s" environment!'.bgYellow,
        process.env.NODE_ENV);
    } else {
      debug('NODE_ENV is not defined!'.bgYellow);
    }

    // Defaults to development
    process.env.NODE_ENV = 'development';
  } else if (filePath.length > 1) {
    // Merge multiple config files;
    _.forEach(filePath, function (path) {
      config = _.assign(config, require(path) || {});
    });
  } else {
    config = _.assign(config, require(filePath) || {});
  }

  return config;
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

  for (var i = 0; i < patterns.length; i++) {
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

Config.prototype.getCSS = function () {
  return this.getGlobbedFiles(_.union(this.main.assets.lib.css,
    this.main.assets.app.css), this.main.public);
};

Config.prototype.getJS = function () {
  return this.getGlobbedFiles(_.union(this.main.assets.lib.js,
    this.main.assets.app.js), this.main.public);
};

Config.prototype.getTmpl = function () {
  return this.getGlobbedFiles(_.union(this.main.assets.lib.tmpl,
    this.main.assets.app.tmpl), this.main.public);
};

module.exports = new Config();
