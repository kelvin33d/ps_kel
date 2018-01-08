import * as express from 'express';
import * as logger from 'morgan';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import * as compress from 'compression';
import * as methodOverride from 'method-override';
import * as expressWinston from 'express-winston';
import * as session from 'express-session';
import * as expressValidation from 'express-validation';
import * as helmet from 'helmet';
import * as lusca from 'lusca';
import * as SequelizeStore from 'connect-session-sequelize';
import winstonInstance from './logger';
import config from '../config';
import httpStatus from './http-status';
import APIError from './APIError';

const Store = SequelizeStore(session.Store);

export default {
  initLocalVariables(app) {
    // Setting application local variables
    app.locals.title = config.app.title;
    app.locals.description = config.app.description;
    app.locals.keywords = config.app.keywords;
    app.locals.googleAnalyticsTrackingID = config.app.googleAnalyticsTrackingID;
    app.locals.facebookAppId = config.OAuth.Facebook.clientID;
    app.locals.twitterUsername = config.OAuth.Twitter.username;
    app.locals.env = config.env;
    app.locals.domain = config.domain;

    // Passing the request url to environment locals
    app.use((req, res, next) => {
      res.locals.host = `${req.protocol} :// ${req.hostname}`;
      res.locals.url = `${req.protocol}:// ${req.headers.host} ${req.originalUrl}`;
      next();
    });
  },
  initMiddleware(app) {
    // Should be placed before express.static
    app.use(compress({
      filter: function filter(req, res) {
        return (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type'));
      },
      level: 9
    }));
    // enable detailed API logging in dev env
    if (config.env === 'development') {
      app.use(logger('dev'));
      expressWinston.requestWhitelist.push('body');
      expressWinston.responseWhitelist.push('body');
      app.use(expressWinston.logger({
        winstonInstance,
        meta: true, // optional: log meta data about request (defaults to true)
        msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
        colorStatus: true // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
      }));
    }
    // Request body parsing middleware should be above methodOverride
    app.use(bodyParser.urlencoded({
      extended: true
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    // Add the cookie parser
    app.use(cookieParser());

    // enable CORS - Cross Origin Resource Sharing
    app.use(cors());
  },
  initViewEngine() {

  },
  initSession(app, db) {
    const S = new Store({
      db: db.sequelize
    });
    app.use(session({
      saveUninitialized: true,
      resave: true,
      secret: config.sessionSecret,
      cookie: {
        maxAge: config.sessionCookie.maxAge,
        httpOnly: config.sessionCookie.httpOnly,
        secure: config.sessionCookie.secure && config.secure.ssl
      },
      name: config.sessionKey,
      store: S
    }));

    S.sync();
    // Add Lusca CSRF Middleware
    app.use(lusca(config.csrf));
  },
  /**
 * Invoke modules server configuration
 */
  initModulesConfiguration(app, db) {
    config.files.server.configs.forEach((configPath) => {
      require(path.resolve(configPath))(app, db); // eslint-disable-line global-require
    });
  },
  initHelmetHeaders(app) {
    const SIX_MONTHS = 15778476000;
    app.use(helmet.frameguard());
    app.use(helmet.xssFilter());
    app.use(helmet.noSniff());
    app.use(helmet.ieNoOpen());
    app.use(helmet.hsts({
      maxAge: SIX_MONTHS,
      includeSubdomains: true,
      force: true
    }));
    app.disable('x-powered-by');
  },
  initModulesClientRoutes() {

  },
  initModulesServerPolicies(app) {
    config.files.server.policies.forEach((policyPath) => {
      require(path.resolve(policyPath)).invokeRolesPolicies(); // eslint-disable-line global-require
    });
  },
  initModulesServerRoutes(app) {
    config.files.server.routes.forEach((routePath) => {
      require(path.resolve(routePath))(app); // eslint-disable-line global-require
    });
  },
  initErrorRoutes(app) {
    // if error is not an instanceOf APIError, convert it.
    app.use((err, req, res, next) => {
      if (err instanceof expressValidation.ValidationError) {
      // validation error contains errors which is an array of error each containing message[]
        const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
        const error = new APIError(unifiedErrorMessage, err.status, true);
        return next(error);
      } else if (!(err instanceof APIError)) {
        const apiError = new APIError(err.message, err.status, err.isPublic);
        return next(apiError);
      }
      return next(err);
    });

  // catch 404 and forward to error handler
    app.use((req, res, next) => {
      const err = new APIError('API not found', httpStatus.NOT_FOUND);
      return next(err);
    });

    // log error in winston transports except when executing test suite
    if (config.env !== 'test') {
      app.use(expressWinston.errorLogger({
        winstonInstance
      }));
    }

    // error handler, send stacktrace only during development
    app.use((err, req, res, next) => // eslint-disable-line no-unused-vars
      res.status(err.status).json({
        message: err.isPublic ? err.message : httpStatus[err.status],
        stack: config.env === 'development' ? err.stack : {}
      })
    );
  },
  configureSocketIO(app, db) {
    // const server = require('./socket.io')(app, db); // eslint-disable-line global-require

    // return server;
  },
  init(db) {
    let app = express();

    // Initialize local variables
    this.initLocalVariables(app);

    // Initialize Express middleware
    this.initMiddleware(app);

    // Initialize Helmet security headers
    this.initHelmetHeaders(app);

    // Initialize Express session
    this.initSession(app, db);

    // Initialize Modules configuration
    this.initModulesConfiguration(app, db);

    // Initialize modules server authorization policies
    this.initModulesServerPolicies(app);

    // Initialize modules server routes
    this.initModulesServerRoutes(app);

    // Initialize error routes
    this.initErrorRoutes(app);

    // Configure Socket.io
    // app = this.configureSocketIO(app, db);
    return app;
  }
};
