'use strict';

module.exports = {
  main: {
    app: {
      title: 'DevDiary',
      description: 'Helping developers to better keep track of their work',
      keywords: ''
    },
    templateEngine: 'swig',
    port: process.env.PORT || 8080,
    host: process.env.HOST || undefined,
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
    hsts: {
      maxAge: 10886400000,
      includeSubdomains: true,
      preload: true,
      force: true
    },
    public: './client',
    assets: {
      lib: {
        css: [],
        js: ['./client/bower_components/webcomponentsjs/webcomponents.js'],
        tmpl: [
        './client/bower_components/polymer/polymer.html',
        './client/bower_components/core-header-panel/core-header-panel.html',
        './client/bower_components/core-drawer-panel/core-drawer-panel.html',
        './client/bower_components/core-toolbar/core-toolbar.html',
        './client/bower_components/core-pages/core-pages.html',
        './client/bower_components/core-menu/core-menu.html',
        './client/bower_components/core-icons/core-icons.html',
        './client/bower_components/core-item/core-item.html',
        './client/bower_components/paper-icon-button/paper-icon-button.html',
        './client/bower_components/paper-menu-button/paper-menu-button.html',
        './client/bower_components/paper-dropdown/paper-dropdown.html',
        './client/bower_components/paper-item/paper-item.html',
        './client/bower_components/paper-input/paper-input.html',
        './client/bower_components/core-field/core-field.html'
      ]
      },
      app: {
        css: ['./client/styles/style.css'],
        js: ['./client/scripts/*.js'],
        tmpl: ['./client/elements/*.html']
      }
    }
  },

  auth: {
    admin: {
      local: false
    },

    prefix: '/',

    urlpath: {
      'login': 'login',
      'logout': 'logout',
      'instance': 'instance',
      'register': 'register',
      'reset_create': 'reset_create',
      'reset_load': 'reset_load',
      'reset_execute': 'reset_execute',
    },

    restrict: '/',

    // urls patterns to ignore (don't bother looking for user)
    exclude: /(\.ico|\.css|\.png|\.jpg|\.gif)$/,

    // urls patterns to process  (always look for user)
    include: [],
    sendemail: false,
    email: {
      send: false,
      code: {
        'register': 'auth-register',
        'create_reset': 'auth-create-reset'
      },
      subject: {
        'register': 'Welcome!',
        'create_reset': 'Password Reset'
      }
    },

    // redirect settings, if redirecting
    redirect: {
      always: true,
      win: '/',
      fail: '/',
      restrict: '/',

      'login': {
        win: '/',
        fail: '/login',
      },
      'logout': {
        win: '/login',
        fail: '/',
      },
      'register': {
        win: '/',
        fail: '/',
      },
      'reset_create': {
        win: '/',
        fail: '/',
      },
      'reset_load': {
        win: '/',
        fail: '/',
      },
      'reset_execute': {
        win: '/',
        fail: '/',
      },
      'confirm': {
        win: '/',
        fail: '/',
      },
    },
    register: {
      fields: {
        name: 'name',
        nick: 'nick',
        email: 'email',
        password: 'password',
        repeat: 'repeat',
        username: 'nick'
          // add more
      }
    },
    login: {
      fields: {
        username: 'nick'
      }
    },

    user: {
      updatefields: ['name', 'email']
    },

    defaultpages: false,
    loginpages: [
      {
        path: '/login/admin',
        redirect: '/admin',
        title: 'Administration'
      },
      {
        path: '/login',
        redirect: '/',
        title: 'Account'
      }
    ]
  },

  mail: {
    mail: {
      from: 'info@razvanl.com'
    },
    config: {
      service: 'Gmail',
      auth: {
        user: 'razvan.laurus@gmail.com',
        pass: ''
      }
    }
  },

  user: {
    autopass: true,
    confirm: true //,
      // mustrepeat: true
  }
};
