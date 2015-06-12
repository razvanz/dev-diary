'use strict';

module.exports = function (app) {

  app.all('/api/v1.0/*',
    function (req, res, next) {
      console.log('Authentication + authorisation');
      return next('route');
    });

  require('./project/')(app);
};
