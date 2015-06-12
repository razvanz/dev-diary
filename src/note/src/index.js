'use strict';

var _ = require('lodash'),
  uuid = require('node-uuid');

module.exports = function (options) {
  var seneca = this;
  var plugin = 'note';

  options = seneca.util.deepextend({}, options || {});

  seneca.add({
    role: plugin,
    cmd: 'list'
  }, listNotes);

  seneca.add({
    role: plugin,
    cmd: 'create',

    data: {}
  }, createNote);

  seneca.add({
    role: plugin,
    cmd: 'load',

    query: {
      id: ''
    }
  }, loadNote);

  seneca.add({
    role: plugin,
    cmd: 'update',

    data: {}
  }, updateNote);

  seneca.add({
    role: plugin,
    cmd: 'remove',

    query: {
      id: ''
    }
  }, removeNote);

  function listNotes(argv, done) {
    console.log('List notes');
    return seneca.make$('note')
      .list$(argv.query, done);
  }

  function createNote(argv, done) {

    var note = seneca.make$('note');

    note = _.assign(note, argv.data, {
      id: uuid.v4()
    });

    return note.save$(done);
  }

  function loadNote(argv, done) {
    return seneca.make$('note')
      .load$(argv.query, done);
  }

  function updateNote(argv, done) {
    return seneca.make$('note')
      .load$(argv.data, function (err, note) {
        if (err)
          return done(err);
        else {
          note = note = _.assign(note, argv.data);

          return note.save$(done);
        }
      });
  }

  function removeNote(argv, done) {
    return seneca.make$('note')
      .remove$(argv.query, done);
  }

  return {
    name: plugin
  };
};
