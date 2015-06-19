'use strict';

var _ = require('lodash'),
  uuid = require('node-uuid');

module.exports = function (options) {
  var seneca = this;
  var plugin = 'project';

  options = seneca.util.deepextend({}, options || {});

  seneca.add({
    role: plugin,
    cmd: 'list',
    query: {}
  }, listProjects);

  seneca.add({
    role: plugin,
    cmd: 'create',
    data: {}
  }, createProject);

  seneca.add({
    role: plugin,
    cmd: 'load',
    query: {}
  }, loadProject);

  seneca.add({
    role: plugin,
    cmd: 'update',
    data: {}
  }, updateProject);

  seneca.add({
    role: plugin,
    cmd: 'remove',
    query: {}
  }, removeProject);

  function listProjects(argv, done) {
    if (!argv.query.username)
      return done(new Error('Invalid username'));

    return seneca.make$('project')
      .list$(argv.query, done);
  }

  function createProject(argv, done) {
    if (!argv.data.username)
      return done(new Error('Invalid username'));

    var project = seneca.make$('project');

    project = _.assign(project, argv.data, {
      id: uuid.v1()
    });

    return project.save$(done);
  }

  function loadProject(argv, done) {
    if (!argv.query.username)
      return done(new Error('Invalid username'));

    return seneca.make$('project')
      .load$(argv.query, done);
  }

  function updateProject(argv, done) {
    if (!argv.data.username)
      return done(new Error('Invalid username'));

    return seneca.make$('project')
      .load$({
        id: argv.data.id,
        username: argv.data.username
      }, function (err, project) {
        if (err)
          return done(err);
        else {
          project = project = _.assign(project, argv.data);

          return project.save$(done);
        }
      });
  }

  function removeProject(argv, done) {
    if (!argv.query.username)
      return done(new Error('Invalid username'));

    return seneca.make$('project')
      .remove$(argv.query, done);
  }

  return {
    name: plugin
  };
};
