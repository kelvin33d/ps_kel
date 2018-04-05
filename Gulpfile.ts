import * as _ from 'lodash';
import * as fs from 'fs';
import * as glob from 'glob';
import * as gulp from 'gulp';
import * as rollup from 'gulp-rollup';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import * as runSequence from 'run-sequence';
import * as path from 'path';
import * as del from 'del';
import * as resolve from 'rollup-plugin-node-resolve';
import defaultAssets from './config/assets/default';
import testAssets from './config/assets/test';

console.log(defaultAssets);
const PLUGINS = gulpLoadPlugins();

// console.log(PLUGINS);

const tsProject = PLUGINS.typescript.createProject('tsconfig.json');
const clientTsProject = PLUGINS.typescript.createProject({
    "target": "ES5",
    "module": "system",
    "moduleResolution": "node",
    "sourceMap": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "removeComments": true,
    "noImplicitAny": false
});
// const BUILD_DIR = './dist';
const VERSION = require('./package.json').version;

// // Local settings
// let changedTestFiles = [];

// Set NODE_ENV to 'test'
gulp.task('env:test', function () {
  process.env.NODE_ENV = 'test';
});

// Set NODE_ENV to 'development'
gulp.task('env:dev', function () {
  process.env.NODE_ENV = 'development';
});

// Set NODE_ENV to 'production'
gulp.task('env:prod', function () {
  process.env.NODE_ENV = 'production';
});

// Nodemon task
gulp.task('nodemon', function () {

  let nodeVersions = process.versions;
  let debugArgument = '--debug';
  switch (nodeVersions.node.substr(0, 1)) {
    case '4':
    case '5':
    case '6':
      debugArgument = '--debug';
      break;
    case '7':
    case '8':
    case '9':
      debugArgument = '--inspect';
      break;
  }

  return PLUGINS.nodemon({
    script: 'dist/server.js',
    nodeArgs: [debugArgument],
    ext: 'js,html',
    verbose: true,
    watch: _.union(defaultAssets.server.views, defaultAssets.server.allJs, defaultAssets.server.config)
  });
});

gulp.task('watch', () => {

});
// Nodemon task without verbosity or debugging
gulp.task('nodemon-nodebug', function () {
  return PLUGINS.nodemon({
    script: 'server.js',
    ext: 'js,html,ts',
    watch: _.union(defaultAssets.server.views, defaultAssets.server.allJs, defaultAssets.server.config)
  });
});

gulp.task('clean', (cb) => {
  return del(["dist"], cb);
});

gulp.task('tslint', () => {
  return gulp.src("src/**/*.ts")
    .pipe(PLUGINS.tslint({
        formatter: 'prose'
    }))
    .pipe(PLUGINS.tslint.report());
});

gulp.task("compile-server", /*["tslint"],*/ () => {
  const tsResult = gulp.src(['src/**/*', '!src/modules/**/client/**/*'])
    .pipe(PLUGINS.sourcemaps.init())
    .pipe(tsProject());
  return tsResult.js
    .pipe(PLUGINS.sourcemaps.write(".", {sourceRoot: '/src'}))
    .pipe(gulp.dest("dist"));
});

// gulp.task('compile-client',/*["tslint"] */() => {
//   const tsProject = gulp.src(['src/modules/**/client/**/*'])
// });
gulp.task("libs", () => {
  const tsResult = gulp.src([
      'core-js/client/shim.min.js',
      'systemjs/dist/system-polyfills.js',
      'systemjs/dist/system.src.js',
      'reflect-metadata/Reflect.js',
      'rxjs/**',
      'zone.js/dist/**',
      '@angular/**'
  ], {cwd: "node_modules/**"}) /* Glob required here. */
    .pipe(tsProject())
    return tsResult.js.pipe(gulp.dest("dist/public"))
});

gulp.task('bump',() => {
  gulp.src(['./package.json'], {base: './'})
    .pipe(PLUGINS.bump({
      version: VERSION
    }))
    .pipe(gulp.dest('./'));
});
;

