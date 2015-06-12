'use strict';

module.exports = function (app) {
  app.route('/')
    .get(function (req, res) {
      return res.render('app');
    });

  require('./api')(app);
};
