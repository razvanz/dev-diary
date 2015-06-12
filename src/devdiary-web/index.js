'use strict';

/*
 * Handling unsolved exceptions
 */
process.on('uncaughtException', function (err) {
  console.error('uncaughtException:', err.message);
  console.error(err.stack);
  process.exit(1);
});

/*
 * the server
 */
var _ = require('lodash'),
  bodyParser = require('body-parser'),
  compress = require('compression'),
  consolidate = require('consolidate'),
  cookieParser = require('cookie-parser'),
  csrf = require('csurf'),
  express = require('express'),
  favicon = require('serve-favicon'),
  helmet = require('helmet'),
  hpp = require('hpp'),
  methodOverride = require('method-override'),
  morgan = require('morgan'),
  path = require('path'),
  seneca = require('seneca')(),
  session = require('express-session'),
  config = require('../../config/');

var options = config.init();

seneca.use('options', options)
  .use('rabbitmq-transport')
  .use('mem-store', {
    web: {
      dump: true
    }
  })
  .client({
    type: 'rabbitmq'
  })
  .ready(function () {
    /*
     * Configure
     */

    var app = express();

    app.locals = _.assign(app.locals, options.main.app, {
      resources: {
        css: config.getCSS(),
        js: config.getJS(),
        tmpl: config.getTmpl()
      }
    });

    // Passing the request url to environment locals
    app.use(function (req, res, next) {
      res.locals.url = req.protocol + '://' + req.headers.host + req.url;
      next();
    });

    // Should be placed before express.static
    app.use(compress({
      // only compress files for the following content types
      filter: function (req, res) {
        return (/json|text|javascript|css/)
          .test(res.getHeader('Content-Type'));
      },
      // zlib option for compression level
      level: 3
    }));

    // Showing stack errors
    app.set('showStackError', true);

    // Request body parsing middleware should be above methodOverride
    app.use(bodyParser.urlencoded({
      extended: true
    }));
    app.use(bodyParser.json({
      strict: true
    }));
    app.use(hpp());

    // use HTTP verbs such as PUT or DELETE where the client doesn't support it
    app.use(methodOverride());

    // Cookie parser
    app.use(cookieParser());

    // Use helmet to secure Express headers
    app.use(helmet.hsts(options.main.hsts));
    app.use(helmet.ieNoOpen());
    app.use(helmet.frameguard('deny'));
    app.use(helmet.xssFilter({
      setOnOldIE: true
    }));
    app.use(helmet.noSniff());
    app.use(helmet.xframe());
    app.disable('x-powered-by');

    // View cache + logger based on environment
    if (process.env.NODE_ENV === 'production') {
      app.locals.cache = 'memory';
    } else {
      app.set('view cache', false);
      app.use(morgan('dev'));
    }

    // Session storage
    app.use(session(_.assign(options.main.session, {
      store: undefined // replace with a store
    })));

    // // Not sure how this plays with seneca
    // // use passport session
    // app.use(passport.initialize());
    // app.use(passport.session());

    // Cross-site request forgery
    // app.use('/api/', csrf({
    //   value: function (req) {
    //     return (req.body && req.body._csrf) ||
    //       (req.query && req.query._csrf) ||
    //       (req.headers['x-csrf-token']) ||
    //       (req.headers['x-xsrf-token']);
    //   }
    // }));

    app.use(favicon(path.resolve(options.main.public + '/images/favicon.ico')));

    // Set swig as the template engine
    // Set views path and view engine
    app.engine('html', consolidate[options.main.templateEngine]);
    app.set('views', path.resolve(options.main.public + '/views'));
    app.set('view engine', 'html');

    // Serve static
    app.use(express.static(path.resolve(options.main.public)));

    app.use(seneca.export('web'));

    require('./src/routes/')(app);

    // Start the app
    app.listen(options.main.port);

    console.log('--');
    console.log('Server started!');
    console.log('Environment:\t\t\t' + process.env.NODE_ENV);
    console.log('Port:\t\t\t\t' + options.main.port);
    console.log('--');
  });