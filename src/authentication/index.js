'use strict';

var path = require('path');

require('seneca')()
  .use('jsonfile-store', {
    folder: path.resolve('src/authentication', 'data')
  })
  .use('./src/')
  .use('rabbitmq-transport')
  .listen({
    type: 'rabbitmq',
    pin: {
      role: 'auth',
      cmd: '*'
    }
  })
  .client({
    type: 'rabbitmq',
    pin: {
      role: 'user',
      cmd: '*'
    }
  });
