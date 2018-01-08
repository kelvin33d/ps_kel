const Joi = require('joi');
// require and configure dotenv, will load vars in env in PROCESS.ENV
require('dotenv').config({
  path: '../../../.env'
});

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test', 'provision'])
    .default('development'),

  PORT: Joi.number()
    .default(4040),

  JWT_SECRET: Joi.string().default('api')
    .description('JWT Secret required to sign'),
  HOST: Joi.string().default('0.0.0.0'),

  AWS_SECRET_ACCESS_KEY: Joi.string().default(''),
  AWS_KEY_ACCESS_ID: Joi.string().default(''),
  APP_TITLE: Joi.string().default('API'),

  APP_DESCRIPTION: Joi.string().default('REST API using express, mongoose in ES6 with code coverage'),

  APP_KEYWORDS: Joi.string().default('nodejs, REST API, mongoDB'),

  GOOGLE_ANALYTICS_TRACKING_ID: Joi.string().default('GOOGLE_ANALYTICS_TRACKING_ID'),

  DOMAIN: Joi.string().default('http://0.0.0.0'),
  OWASP_ALLOW_PASSPHRASES: Joi.boolean().default(true),
  OWASP_MAX_LENGTH: Joi.number().default(128),
  OWASP_MIN_LENGTH: Joi.number().default(10),
  OWASP_MIN_PHRASE_LENGTH: Joi.number().default(20),
  ILLEGALUSERNAMES: Joi.string().default('administrator,password,admin,user,unknown,anonymous,null,undefined,api'),
  OWASP_MIN_OPTIONAL_TESTS_TO_PASS: Joi.number().default(4),
  OAUTH_FACEBOOK_CLIENT_ID: Joi.string().default('APP_ID'),
  OAUTH_FACEBOOK_CLIENT_SECRET: Joi.string().default('APP_SECRET'),
  OAUTH_FACEBOOK_CALLBACK_URL: Joi.string().default('/api/auth/facebook/callback'),
  OAUTH_GOOGLE_CLIENT_ID: Joi.string().default('APP_ID'),
  OAUTH_GOOGLE_CLIENT_SECRET: Joi.string().default('APP_ID'),
  OAUTH_GOOGLE_CALLBACK_URL: Joi.string().default('/api/auth/google/callback'),
  OAUTH_TWITTER_USERNAME: Joi.string().default('username'),
  OAUTH_TWITTER_KEY: Joi.string().default('CONSUMER_KEY'),
  OAUTH_TWITTER_SECRET: Joi.string().default('CONSUMER_SECRET'),
  OAUTH_TWITTER_CALLBACK_URL: Joi.string().default('/api/auth/twitter/callback'),
  MAILER_FROM: Joi.string().default('MAILER_FROM'),
  MAILER_SERVICE_PROVIDER: Joi.string().default('MAILER_SERVICE_PROVIDER'),
  MAILER_EMAIL_ID: Joi.string().default('MAILER_EMAIL_ID'),
  MAILER_PASSWORD: Joi.string().default('MAILER_PASSWORD'),
  SESSION_COOKIE_MAX_AGE: Joi.number().default(86400000),
  SESSION_COOKIE_HTTP_ONLY: Joi.boolean().default(true),
  SESSION_COOKIE_HTTP_SECURE: Joi.boolean().default(false),
  SESSION_SECRET: Joi.string().default('Wedding-planning'),
  SESSION_KEY: Joi.string().default('sessionId'),
  SESSION_COLLECTION: Joi.string().default('sessions'),
  CSFR: Joi.boolean().default(false),
  CSRF_CSP: Joi.boolean().default(false),
  CSRF_XFRAME: Joi.string().default('SAMEORIGIN'),
  CSRF_P3P: Joi.string().default('ABCDEF'),
  CSRF_XSS_PROTECTION: Joi.boolean().default(true),
  POSTGRES_DB_NAME: Joi.string().default('postgres'),
  POSTGRES_DB_USER: Joi.string().default('postgres'),
  POSTGRES_DB_PASSWORD : Joi.string().default('xtrace'),
  POSTGRES_DB_DIALECT: Joi.string().default('postgres')
}).unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  host: envVars.HOST,
  sequelizeDebug: envVars.SEQUELIZE_DEBUG,
  jwtSecret: envVars.JWT_SECRET,
  illegalUsernames: envVars.ILLEGALUSERNAMES,
  orm: {
    dbname: envVars.POSTGRES_DB_NAME,
    user:  envVars.POSTGRES_DB_USER,
    pass: envVars.POSTGRES_DB_PASSWORD,
    options: {
      dialect: envVars.POSTGRES_DB_DIALECT,
      host: '',
      port: '',
      logging: false
    }
  },
  app: {
    title: envVars.APP_TITLE,
    description: envVars.APP_DESCRIPTION,
    keywords: envVars.APP_KEYWORDS,
    google_analytics_tracking_id: envVars.GOOGLE_ANALYTICS_TRACKING_ID,
    domain: envVars.DOMAIN
  },
  AWS: {
    AWS_SECRET_ACCESS_KEY: envVars.AWS_SECRET_ACCESS_KEY,
    AWS_KEY_ACCESS_ID: envVars.AWS_KEY_ACCESS_ID
  },
  shared: {
    owasp: {
      allowPassphrases: envVars.OWASP_ALLOW_PASSPHRASES,
      maxLength: envVars.OWASP_MAX_LENGTH,
      minLength: envVars.OWASP_MIN_LENGTH,
      minPhraseLength: envVars.OWASP_MIN_PHRASE_LENGTH,
      minOptionalTestsToPass: envVars.OWASP_MIN_OPTIONAL_TESTS_TO_PASS
    }
  },
  sessionSecret: envVars.SESSION_SECRET,
  sessionCookie: {
    maxAge: envVars.SESSION_COOKIE_MAX_AGE,
    httpOnly: envVars.SESSION_COOKIE_HTTP_ONLY,
    secure: envVars.SESSION_COOKIE_HTTP_SECURE,
  },
  csrf: {
    csrf: envVars.CSFR,
    csp: envVars.CSRF_CSP,
    xframe: envVars.CSRF_XFRAME,
    p3p: envVars.CSRF_P3P,
    xssProtection: envVars.CSRF_XSS_PROTECTION
  },
  sessionKey: envVars.SESSION_KEY,
  sessionCollection: envVars.SESSION_COLLECTION,
  OAuth: {
    Facebook: {
      clientID: envVars.OAUTH_FACEBOOK_CLIENT_ID,
      clientSecret: envVars.OAUTH_FACEBOOK_CLIENT_SECRET,
      callbackURL: envVars.OAUTH_FACEBOOK_CALLBACK_URL
    },
    Google: {
      clientID: envVars.OAUTH_GOOGLE_CLIENT_ID,
      clientSecret: envVars.OAUTH_TWITTER_SECRET,
      callbackURL: envVars.OAUTH_GOOGLE_CALLBACK_URL,
    },
    Twitter: {
      username: envVars.OAUTH_TWITTER_USERNAME,
      clientID: envVars.OAUTH_TWITTER_KEY,
      clientSecret: envVars.OAUTH_TWITTER_SECRET,
      callbackURL: envVars.OAUTH_TWITTER_CALLBACK_URL
    }
  }
};
