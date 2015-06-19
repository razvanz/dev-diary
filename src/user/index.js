'use strict';

var path = require('path');

require('seneca')()
  .use('jsonfile-store', {
    folder: path.resolve('src/user', 'data')
  })
  .use('./src/')
  .use('rabbitmq-transport')
  .listen({
    type: 'rabbitmq',
    pin: {
      role: 'user',
      cmd: '*',
    }
  });
