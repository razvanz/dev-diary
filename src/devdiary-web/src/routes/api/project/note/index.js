'use strict';

var _ = require('lodash');

module.exports = function (app) {

  app.all('/api/v1.0/project/:projectId/note(/*)?', function (req, res, next) {
    console.log('Authorize note');
    return next('route');
  });

  app.all('/api/v1.0/project/:projectId/note/:noteId*',
    function (req, res, next) {
      console.log('Authorize noteId');
      return next('route');
    });

  app.route('/api/v1.0/project/:projectId/note')
    .get(function (req, res, next) {
      return req.seneca.act({
        role: 'note',
        cmd: 'list'
      }, req.query, function (err, notes) {
        if (err)
          return next(err);
        else {
          return res.jsonp(notes);
        }
      });
    })
    .post(function (req, res, next) {
      return req.seneca.act({
        role: 'note',
        cmd: 'create',
        data: _.assign({}, req.body)
      }, function (err, note) {
        if (err)
          return next(err);
        else {
          return res.jsonp(note);
        }
      });
    });

  app.route('/api/v1.0/project/:projectId/note/:noteId')
    .get(function (req, res, next) {
      return req.seneca.act({
        role: 'note',
        cmd: 'load',
        query: {
          id: req.params.noteId
        }
      }, function (err, note) {
        if (err)
          return next(err);
        else {
          return res.jsonp(note);
        }
      });
    })
    .put(function (req, res, next) {
      return req.seneca.act({
        role: 'note',
        cmd: 'update',
        data: _.assign(req.body, {
          id: req.params.noteId
        })
      }, function (err, note) {
        if (err)
          return next(err);
        else {
          return res.jsonp(note);
        }
      });
    })
    .delete(function (req, res, next) {
      return req.seneca.act({
        role: 'note',
        cmd: 'remove',
        query: {
          id: req.params.noteId
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
};
