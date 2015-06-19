'use strict';

var _ = require('lodash'),
  uuid = require('node-uuid');

module.exports = function (options) {
  var seneca = this;
  var plugin = 'user';

  options = seneca.util.deepextend({}, options || {});

  seneca.add({
    role: plugin,
    cmd: 'list',

    query: {}
  }, listUsers);

  seneca.add({
    role: plugin,
    cmd: 'create',

    data: {}
  }, createUser);

  seneca.add({
    role: plugin,
    cmd: 'load',

    query: {}
  }, loadUser);

  seneca.add({
    role: plugin,
    cmd: 'update',

    data: {}
  }, updateUser);

  seneca.add({
    role: plugin,
    cmd: 'remove',

    query: {}
  }, removeUser);

  function listUsers(argv, done) {
    return seneca.make$('user')
      .list$(argv.query, done);
  }

  function createUser(argv, done) {

    if (!argv.data.email || !argv.data.username || !argv.data.password ||
      !argv.data.salt) {
      return done(new Error('Invalid user object'));
    }

    if (!('active' in argv.data))
      argv.data.active = true;

    return seneca.make$('user')
      .list$({
        username: argv.data.username
      }, function (err, users) {
        if (err) {
          return done(err);
        } else if (users && users.length) {
          return done(null, {
            error: 'Username already in use'
          });
        } else {
          var user = seneca.make$('user');

          user = _.assign(user, argv.data, {
            id: uuid.v1()
          });

          return user.save$(done);
        }
      });
  }

  function loadUser(argv, done) {
    return seneca.make$('user')
      .load$(argv.query, done);
  }

  function updateUser(argv, done) {
    return seneca.make$('user')
      .load$(argv.data, function (err, user) {
        if (err)
          return done(err);
        else {
          user = user = _.assign(user, argv.data);

          return user.save$(done);
        }
      });
  }

  function removeUser(argv, done) {
    return seneca.make$('user')
      .remove$(argv.query, done);
  }

  return {
    name: plugin
  };
};
