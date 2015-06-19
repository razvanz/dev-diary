'use strict';

module.exports = function (app) {

  app.all('/api/v1.0/*',
    function (req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      } else {
        return res.redirect('/login');
      }
    },
    function (req, res, next) {
      return next('route');
    });

  require('./project/')(app);
};
