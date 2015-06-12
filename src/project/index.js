'use strict';

var path = require('path');

require('seneca')()
  .use('rabbitmq-transport')
  .use('jsonfile-store', {
    folder: path.resolve('src/project', 'data')
  })
  .use('./src/')
  .listen({
    type: 'rabbitmq'
  });
