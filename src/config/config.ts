import * as glob from 'glob';
import * as _ from 'lodash';
import * as path from 'path';
import defaultConfig from './env/default';
import defaultAssets from './assets/default';

/**
 * Get files by glob patterns
 */
const getGlobbedPaths = (globPatterns, excludes) => {
  // URL paths regex
  const urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i'); // eslint-disable-line no-useless-escape

  // The output array
  let output = [];

  // If glob pattern is array then we use each pattern in a recursive way, otherwise we use glob
  if (Array.isArray(globPatterns)) {
    globPatterns.forEach((globPattern) => {
      output = _.union(output, getGlobbedPaths(globPattern, excludes));
    });
  } else if (Object.prototype.toString.call(globPatterns) === '[object String]') {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns);
    } else {
      let files = glob.sync(globPatterns);
      if (excludes) {
        files = files.map((file) => {
          if (Array.isArray(excludes)) {
            for (const i in excludes) {
              if (excludes.hasOwnProperty(i)) {
                file = file.replace(excludes[i], '');
              }
            }
          } else {
            file = file.replace(excludes, '');
          }
          return file;
        });
      }
      output = _.union(output, files);
    }
  }
  return output;
};

/**
 * Validate Session Secret parameter is not set to default in production
 */
const validateSessionSecret = (config, testing) => {

  if (defaultConfig.env !== 'production') {
    return true;
  }
  if (config.sessionSecret === 'kt-app') {
    if (!testing) {
      console.log('+ WARNING: It is strongly recommended that you change sessionSecret config while running in production!');
      console.log(' Please add `sessionSecret: process.env.SESSION_SECRET || \'super amazing secret\'` to ');
      console.log('  `config/env/default`');
      console.log();
    }
    return false;
  } else {
    return true;
  }
};

/**
 * Initialize global configuration files
 */

const initGlobalConfigFolders = (config) => {
  // Appending files
  config.folders = {
    server: {},
    client: {}
  };
};

/**
 * Initialize global configuration files
 */
const initGlobalConfigFiles = (config, assets) => {
  // Appending files
  config.files = {
    server: {},
    client: {}
  };

  // Setting Globbed model files
  config.files.server.models = getGlobbedPaths(assets.server.models);

  // Setting Globbed route files
  config.files.server.routes = getGlobbedPaths(assets.server.routes);

  // Setting Globbed config files
  config.files.server.configs = getGlobbedPaths(assets.server.config);

  // Setting Globbed socket files
  config.files.server.sockets = getGlobbedPaths(assets.server.sockets);

  // Setting Globbed sequelize model files
  config.files.server.sequelizeModels = getGlobbedPaths(assets.server.sequelizeModels);
  // Setting Globbed policies files
  config.files.server.policies = getGlobbedPaths(assets.server.policies);

  // Setting non Js files
  config.files.server.nonJs = getGlobbedPaths(assets.server.nonJs);

  // Setting Globbed test files
  config.files.client.tests = getGlobbedPaths(assets.client.tests);
};

/**
* Init Global config
*/
const initGlobalConfig = () => {
  const assets = _.merge(defaultAssets, {});

  const config = _.merge(defaultConfig, {});

  // config.pkgjson = require(path.resolve('./package.json'));;
  // Initialize global globbed files
  initGlobalConfigFiles(config, assets);

  // Initialize global globbed folders
  initGlobalConfigFolders(config, assets);

  // Validate session secret
  validateSessionSecret(config);
  
  // Expose configuration utilities
  config.utils = {
    getGlobbedPaths: getGlobbedPaths,
    validateSessionSecret: validateSessionSecret
  };
  return config;
};
export default initGlobalConfig();
