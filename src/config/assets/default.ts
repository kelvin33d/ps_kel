export default {
  client: {
    lib: {
      css: [],
      js: [],
      tests: []
    },
    css: ['modules/*/client/**/*.css'],
    less: [],
    sass: [],
    js: [
      'modules/*/client/*.js',
      'modules/*/client/**/*.js'
    ],
    img: [],
    views: ['modules/*/client/**/views/**/*.html'],
    templates: []
  },
  server: {
    gulpConfig: ['Gulpfile.ts'],
    allJs: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    nonJs: ['./package.json', './.gitignore', './.env'],
    sequelizeModels: 'modules/*/server/models/sequelize/**/*.js',
    models: ['modules/*/server/models/**/*.js'],
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    sockets: ['modules/*/server/sockets/**/*.js'],
    config: ['modules/*/server/config/*.js'],
    policies: ['modules/*/server/policies/**/*.js'],
    views: ['modules/*/server/views/*.html']
  }
};
