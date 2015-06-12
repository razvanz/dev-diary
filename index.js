'use strict';

var fs = require('fs'),
  spawn = require('child_process')
  .spawn;

var services = ['project', 'note', 'devdiary-web'];

services.forEach(function (service) {
  var log = fs.createWriteStream('./log/' + service + '.log');
  var proc = spawn('node', ['./src/' + service + '/']);

  proc.stdout.pipe(log);
  proc.stderr.pipe(log);

  proc.stdout.pipe(process.stdout);
  proc.stderr.pipe(process.stderr);
});
