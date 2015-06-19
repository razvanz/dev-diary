'use strict';

var passport = require('passport');

module.exports = function (app) {
  app.route('/')
    .get(function (req, res) {
      if (req.isAuthenticated()) {
        return res.render('index');
      } else {
        return res.redirect('/login');
      }
    });

  app.route('/login')
    .get(function (req, res) {
      return res.render('login');
    })
    .post(function (req, res, next) {
      return passport.authenticate('local', function (err, user, info) {
        if (err) {
          return res.status(500)
            .render('login', {
              errors: [err]
            });
        } else if (!user)
          res.status(400)
          .render('login', {
            errors: [new Error(info.message)]
          });
        else
          return req.login(user, function (err) {
            if (err) {
              return res.status(500)
                .render('login', {
                  errors: [new Error('Server error. Try again later')]
                });
            } else
              return res.redirect('/');
          });
      })(req, res, next);
    });

  app.route('/register')
    .get(function (req, res) {
      return res.render('register');
    })
    .post(function (req, res, next) {
      return req.seneca.act({
        role: 'auth',
        cmd: 'register',
        data: {
          email: req.body.email,
          username: req.body.username,
          password: req.body.password
        }
      }, function (err, user) {
        if (err)
          return next(err);
        else
          return req.login(user, function (err) {
            if (err)
              return res.status(500)
                .render('login', {
                  errors: [new Error('Server error. Try again later')]
                });
            else
              return res.redirect('/');
          });
      });
    });

  app.route('/logout')
    .post(function (req, res) {
      req.logout();
      return res.redirect('/');
    });

  require('./api')(app);
};
