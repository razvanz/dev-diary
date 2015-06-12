'use strict';

var _ = require('lodash'),
  uuid = require('node-uuid');

module.exports = function (options) {
  var seneca = this;
  var plugin = 'project';

  options = seneca.util.deepextend({}, options || {});

  seneca.add({
    role: plugin,
    cmd: 'list'
  }, listProjects);

  seneca.add({
    role: plugin,
    cmd: 'create',

    data: {}
  }, createProject);

  seneca.add({
    role: plugin,
    cmd: 'load',

    query: {
      id: ''
    }
  }, loadProject);

  seneca.add({
    role: plugin,
    cmd: 'update',

    data: {}
  }, updateProject);

  seneca.add({
    role: plugin,
    cmd: 'remove',

    query: {
      id: ''
    }
  }, removeProject);

  function listProjects(argv, done) {
    console.log('List projects');
    return seneca.make$('project')
      .list$(argv.query, done);
  }

  function createProject(argv, done) {

    var project = seneca.make$('project');

    project = _.assign(project, argv.data, {
      id: uuid.v4()
    });

    return project.save$(done);
  }

  function loadProject(argv, done) {
    return seneca.make$('project')
      .load$(argv.query, done);
  }

  function updateProject(argv, done) {
    return seneca.make$('project')
      .load$(argv.data, function (err, project) {
        if (err)
          return done(err);
        else {
          project = project = _.assign(project, argv.data);

          return project.save$(done);
        }
      });
  }

  function removeProject(argv, done) {
    return seneca.make$('project')
      .remove$(argv.query, done);
  }

  return {
    name: plugin
  };
};
