'use strict';

var bodyParser = require('body-parser'),
  compress = require('compression'),
  consolidate = require('consolidate'),
  cookieParser = require('cookie-parser'),
  csrf = require('csurf'),
  express = require('express'),
  helmet = require('helmet'),
  hpp = require('hpp'),
  http = require('http'),
  methodOverride = require('method-override'),
  morgan = require('morgan'),
  passport = require('passport'),
  path = require('path'),
  session = require('express-session');

module.exports = function (config) {
  var app = express();

  app.locals.title = config.app.title;
  app.locals.description = config.app.description;
  app.locals.keywords = config.app.keywords;
  app.locals.jsFiles = config.getJS();
  app.locals.cssFiles = config.getCSS();

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
  app.use(methodOverride());

  // Use helmet to secure Express headers
  app.use(helmet.hsts({
    maxAge: 10886400000,
    includeSubdomains: true,
    preload: true,
    force: true
  }));
  app.use(helmet.ieNoOpen());
  app.use(helmet.frameguard('deny'));
  app.use(helmet.xssFilter({
    setOnOldIE: true
  }));
  app.use(helmet.noSniff());
  app.use(helmet.xframe());
  app.disable('x-powered-by');

  // Set swig as the template engine
  app.engine('server.view.html', consolidate[config.templateEngine]);

  // Set views path and view engine
  app.set('view engine', 'server.view.html');
  app.set('views', './server/views');

  // Environment dependent middleware
  if (process.env.NODE_ENV === 'development') {

    app.use(morgan('dev'));
    app.use(express.static(path.resolve('./client')));
    app.set('view cache', false);

  } else if (process.env.NODE_ENV === 'production') {

    app.use(express.static(path.resolve('./dist')));
    app.locals.cache = 'memory';

  }

  app.use(cookieParser());

  // Session storage
  app.use(session({
    // store: require('./db')
    //   .sessionStorage(session),
    secret: config.session.secret,
    saveUninitialized: config.session.saveUninitialized,
    resave: config.session.resave,
    rolling: config.session.rolling,
    // unset: config.session.unset,
    cookie: config.session.cookie
  }));

  // use passport session
  app.use(passport.initialize());
  app.use(passport.session());

  // Cross-site request forgery
  app.use('/app', csrf({
    value: function (req) {
      return (req.body && req.body._csrf) ||
        (req.query && req.query._csrf) ||
        (req.headers['x-csrf-token']) ||
        (req.headers['x-xsrf-token']);
    }
  }));

  app.use('/api', function (req, res, next) {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    next();
  });

  // Registering the routes
  config.getGlobbedFiles('./app/routes/**/*.js')
    .forEach(function (routePath) {
      require(path.resolve(routePath))(app);
    });

  // Assume 404 since no middleware responded
  app.use(function (req, res) {
    res.send('Not found');
    // res.status(404)
    //   .render('404', {
    //     url: req.originalUrl,
    //     error: 'Not Found'
    //   });
  });

  require('./auth/passport')(config);

  return http.createServer(app);
};
