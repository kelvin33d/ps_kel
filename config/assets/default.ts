export default {
  client: {
    lib: {
      css: [],
      js: [],
      tests: []
    },
    css: ['src/modules/*/client/**/*.css'],
    less: [],
    sass: [],
    js: [
      'src/modules/*/client/*.ts',
      'src/modules/*/client/**/*.ts'
    ],
    img: [],
    views: ['src/modules/*/client/**/views/**/*.html'],
    templates: []
  },
  server: {
    gulpConfig: ['Gulpfile.ts'],
    allJs: ['src/server.ts', 'src/config/**/*.ts', 'src/modules/*/server/**/*.ts'],
    nonJs: ['./package.json', './.gitignore', './.env'],
    sequelizeModels: 'src/modules/*/server/models/sequelize/**/*.ts',
    models: ['src/modules/*/server/models/**/*.ts'],
    routes: ['src/modules/!(core)/server/routes/**/*.ts', 'src/modules/core/server/routes/**/*.ts'],
    sockets: ['src/modules/*/server/sockets/**/*.ts'],
    config: ['src/modules/*/server/config/*.ts'],
    policies: ['src/modules/*/server/policies/**/*.ts'],
    views: ['src/modules/*/server/views/*.html'],
  }
};
