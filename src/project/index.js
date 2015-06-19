'use strict';

var path = require('path');

require('seneca')()
  .use('jsonfile-store', {
    folder: path.resolve('src/project', 'data')
  })
  .use('./src/')
  .use('rabbitmq-transport')
  .listen({
    type: 'rabbitmq',
    pin: {
      role: 'project',
      cmd: '*'
    }
  });
