'use strict';

module.exports = {
  app: {
    title: 'DevDiary',
    description: 'Helping developers to better keep track of their work',
    keywords: '',
  },
  port: process.env.PORT || 8080,
  templateEngine: 'swig',
  session: {
    cookie: {
      // secure: true,  // with HTTPS
      // maxAge: 10 * 60000 // 10 min expiration
      // maxAge: 10000 // 10 s expiration - testing
    },
    resave: true,
    rolling: true,
    saveUninitialized: true,
    secret: 'very_secret',
    unset: 'destroy'
  },
  cssRoot: '',
  jsRoot: '',
  assets: {
    lib: {
      css: [
        'lib/*.css'
      ],
      js: [
        'lib/angular.js',
        'lib/*.js'
      ]
    },
    css: [
      'styles/notos.less'
    ],
    js: [
      'app/app.js',
      'app/**/*.js'
    ]
  },
  testFiles: {
    client: [
      'client/lib/angular.js',
      'client/lib/*.js',
      'client/app/**/*.js',
      'tests/client/_mocks/**/*.mock.js',
      'tests/client/**/*.spec.js'
    ],
    server: [
      'tests/server/_init/_dbConnect.js',
      'server/config/**/*.js',
      'server/controllers/**/*.js',
      'server/models/**/*.js',
      'server/socket-events/**/*.js',
      'server/socket-nsps/**/*.js',
      'server/utils/**/*.js',
      'server/routes/**/*.js',
      'tests/server/**/*.spec.js',
      //exclusions
      '!server/config/database/init/cassandra/index.js'
    ],
    excludeClient: []
  }
};
