'use strict';

module.exports = {
  main: {
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
    public: './dist',
    assets: {
      lib: {
        css: ['./dist/lib/*.css'],
        js: ['./dist/lib/webcomponents.js'],
        tmpl: ['./dist/lib/*.html']
      },
      app: {
        css: ['./dist/styles/style.css'],
        js: [],
        tmpl: ['./dist/elements/*.html']
      }
    }
  },

  user: {
    autopass: false,
    confirm: true,
    mustrepeat: true
  }
};
