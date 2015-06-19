'use strict';

var crypto = require('crypto');

module.exports = function (options) {
  var seneca = this;
  var plugin = 'auth';

  options = seneca.util.deepextend({}, options || {});

  seneca.add({
    role: plugin,
    cmd: 'login',

    data: {}
  }, authenticate);

  seneca.add({
    role: plugin,
    cmd: 'register',

    data: {}
  }, register);

  seneca.add({
    role: plugin,
    cmd: 'recover',

    data: {}
  }, recover);

  seneca.add({
    role: plugin,
    cmd: 'activate',

    data: {}
  }, activate);

  seneca.add({
    role: plugin,
    cmd: 'deactivate',

    data: {}
  }, deactivate);

  seneca.add({
    role: plugin,
    cmd: 'generate-salt',
  }, generateSalt);

  seneca.add({
    role: plugin,
    cmd: 'hash-passwd',

    data: {}
  }, hashPasswd);

  seneca.add({
    role: plugin,
    cmd: 'match-passwd',

    data: {}
  }, matchPasswd);

  seneca.add({
    role: plugin,
    cmd: 'deserialize',

    data: {}
  }, deserialize);

  function authenticate(argv, done) {
    return seneca.act({
      role: 'user',
      cmd: 'load',

      query: {
        username: argv.data.username
      }
    }, function (err, user) {
      if (err)
        return done(err);
      else if (!user || !user.active)
        return done(null, false);
      else {
        return matchPasswd({
          data: {
            password: argv.data.password,
            passwdHash: user.password,
            salt: user.salt
          }
        }, function (err, match) {
          if (err)
            return done(err);
          else if (!match)
            return done(null, {
              success: false,
              message: 'Invalid credentials'
            });
          else
            return done(null, {
              success: true,
              user: {
                username: user.username,
                active: user.active,
                email: user.email,
                id: user.id
              }
            });
        });
      }
    });
  }

  function register(argv, done) {
    return generateSalt({}, function (err, salt) {
      if (err)
        return done(err);
      else
        return hashPasswd({
          data: {
            password: argv.data.password,
            salt: salt
          }
        }, function (err, hash) {
          if (err)
            return done(err);
          else
            return seneca.act({
              role: 'user',
              cmd: 'create',

              data: {
                email: argv.data.email,
                username: argv.data.username,
                password: hash,
                salt: salt,
                active: true
              }
            }, done);
        });
    });
  }

  function recover(argv, done) {
    return done(new Error('Not implemented'));
  }

  function activate(argv, done) {
    return done(new Error('Not implemented'));
  }

  function deactivate(argv, done) {
    return done(new Error('Not implemented'));
  }

  function matchPasswd(argv, done) {
    return hashPasswd({
      data: {
        password: argv.data.password,
        salt: argv.data.salt
      }
    }, function (err, hash) {
      if (err)
        return done(err);
      else
        return done(null, argv.data.passwdHash === hash);
    });
  }

  function generateSalt(argv, done) {
    return done(null, crypto.randomBytes(16)
      .toString('base64'));
  }

  function hashPasswd(argv, done) {
    if (argv.data.password && argv.data.salt) {
      return done(null, crypto.pbkdf2Sync(argv.data.password, argv.data.salt,
          10000, 64)
        .toString('base64'));
    } else
      return done(new Error('Invalid password or salt'));
  }

  function deserialize(argv, done) {
    return seneca.act({
      role: 'user',
      cmd: 'load',

      query: {
        username: argv.data.username
      }
    }, done);
  }

  return {
    name: plugin
  };
};
