'use strict';

var _ = require('lodash'),
  uuid = require('node-uuid');

module.exports = function (options) {
  var seneca = this;
  var plugin = 'note';

  options = seneca.util.deepextend({}, options || {});

  seneca.add({
    'note': 'list'
  }, listNotes);

  seneca.add({
    'note': 'create',

    data: {}
  }, createNote);

  seneca.add({
    'note': 'load',

    query: {}
  }, loadNote);

  seneca.add({
    'note': 'update',

    data: {}
  }, updateNote);

  seneca.add({
    'note': 'remove',

    query: {}
  }, removeNote);

  function listNotes(argv, done) {
    if (!argv.query.username || !argv.query.projectId)
      return done(new Error('Missing username or projectId'));

    return seneca.make$('note')
      .list$(argv.query, done);
  }

  function createNote(argv, done) {

    if (!argv.query.username || !argv.query.projectId)
      return done(new Error('Missing username or projectId'));

    var note = seneca.make$('note');

    note = _.assign(note, argv.data, {
      id: uuid.v1()
    });

    return note.save$(done);
  }

  function loadNote(argv, done) {
    if (!argv.query.username || !argv.query.projectId)
      return done(new Error('Missing username or projectId'));

    return seneca.make$('note')
      .load$(argv.query, done);
  }

  function updateNote(argv, done) {
    if (!argv.query.username || !argv.query.projectId)
      return done(new Error('Missing username or projectId '));

    return seneca.make$('note')
      .load$({
        id: argv.data.id,
        username: argv.data.username,
        projectId: argv.data.projectId
      }, function (err, note) {
        if (err)
          return done(err);
        else {
          note = note = _.assign(note, argv.data);

          return note.save$(done);
        }
      });
  }

  function removeNote(argv, done) {
    if (!argv.query.username || !argv.query.projectId)
      return done(new Error('Missing username or projectId '));

    return seneca.make$('note')
      .remove$(argv.query, done);
  }

  return {
    name: plugin
  };
};
