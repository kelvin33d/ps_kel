import * as path from  'path';
import * as Sequelize from 'sequelize';
import config from '../config';

const orm = {};
let sequelize;

// Instantiate a sequelize connection to an SQL database based on configuration
// from server/config/env/*
try {
  sequelize = new Sequelize(config.orm.dbname, config.orm.user, config.orm.pass, config.orm.options);
} catch (e) {
  throw new Error(e);
}

// Instantiate sequelize models
config.files.server.sequelizeModels.forEach((modelPath) => {
  try {
    let model = sequelize.import(path.resolve(modelPath));
    orm[model.name] = model;
  } catch (e) {
    throw new Error(e);
  }
});

// Once all models have been loaded, establish the associations between them
Object.keys(orm).forEach((modelName) => {
  if (orm[modelName].associate) {
    orm[modelName].associate(orm);
  }
});

// Expose the instantiated sequelize connection object
orm.sequelize = sequelize;

// Expose the global Sequelize library
orm.Sequelize = Sequelize;

orm.sync = function() {
  return this.sequelize.sync();
};
export default orm;
