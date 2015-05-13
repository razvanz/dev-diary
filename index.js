'use strict';

var server = require('./server/server');

server.on('configured', function (config) {
  server.emit('start', config);
});

server.emit('configure');

process.on('SIGINT', function () {
  process.nextTick(function () {
    server.emit('shutdown', 0);
  });
});
