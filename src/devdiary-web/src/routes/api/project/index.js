'use strict';

var _ = require('lodash');

module.exports = function (app) {

  app.all('/api/v1.0/project(/*)?', function (req, res, next) {
    console.log('Authorize project');
    return next('route');
  });

  app.all('/api/v1.0/project/:projectId*', function (req, res, next) {
    console.log('Authorize projectId');
    return next('route');
  });

  app.route('/api/v1.0/project')
    .get(function (req, res, next) {
      return req.seneca.act({
        role: 'project',
        cmd: 'list'
      }, function (err, projects) {
        if (err)
          return next(err);
        else {
          return res.jsonp(projects);
        }
      });
    })
    .post(function (req, res, next) {
      return req.seneca.act({
        role: 'project',
        cmd: 'create',
        data: _.assign({}, req.body)
      }, function (err, project) {
        if (err)
          return next(err);
        else {
          return res.jsonp(project);
        }
      });
    });

  app.route('/api/v1.0/project/:projectId')
    .get(function (req, res, next) {
      return req.seneca.act({
        role: 'project',
        cmd: 'load',
        query: {
          id: req.params.projectId
        }
      }, function (err, project) {
        if (err)
          return next(err);
        else {
          return res.jsonp(project);
        }
      });
    })
    .put(function (req, res, next) {
      return req.seneca.act({
        role: 'project',
        cmd: 'update',
        data: _.assign(req.body, {
          id: req.params.projectId
        })
      }, function (err, project) {
        if (err)
          return next(err);
        else {
          return res.jsonp(project);
        }
      });
    })
    .delete(function (req, res, next) {
      return req.seneca.act({
        role: 'project',
        cmd: 'remove',
        query: {
          id: req.params.projectId
        }
      }, function (err) {
        if (err)
          return next(err);
        else {
          return res.status(200)
            .end();
        }
      });
    });

  require('./note')(app);
};
