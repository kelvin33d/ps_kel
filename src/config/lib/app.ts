import config from '../config';
import express from './express';
import orm from './sequelize';

function startSequelize() {
  return new Promise((resolve, reject) => {
    if (config.orm) {
      orm.sync()
        .then(() => {
          resolve(orm);
        });
    }
  });
}

function startExpress(orm) {
  return new Promise((resolve, reject) => {
    const app = express.init(orm);
    resolve(app);
  });
}

function bootstrap () {
  return new Promise(async function (resolve, reject) {
    const orm = await startSequelize();
    const app = await startExpress(orm);

    resolve({
      orm: orm,
      app: app
    });
   });
};

function start() {
  return new Promise(async function(resolve, reject) {
    const { orm, app } = await bootstrap();

    app.listen(config.port, config.host, function() {
      console.info(`server started on host ${config.host} - port ${config.port} (${config.env})`); // eslint-disable-line no-console
    });
    resolve({
      orm: orm,
      app: app
    })
  });
}

// Expose the boostrap function publically
 export default {
   bootstrap: bootstrap,
   start: start,
 }



