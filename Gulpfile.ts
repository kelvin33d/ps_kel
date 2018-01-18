import * as _ from 'lodash';
import * as fs from 'fs';
import * as  glob from 'glob';
import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import * as runSequence from 'run-sequence';
import * as path from 'path';
import * as del from 'del';
import defaultAssets from './config/assets/default';
import testAssets from './config/assets/test';
import * as  glob from 'glob';
import VERSION from './package.json';

const PLUGINS = gulpLoadPlugins();
const tsProject = PLUGINS.typescript.createProject('tsconfig.json');
const BUILD_DIR = './release';
const LIB_DIR = '';

const ROLLUP_GLOBALS = {
  // Angular dependencies
  '@angular/animations': 'ng.animations',
  '@angular/core': 'ng.core',
  '@angular/common': 'ng.common',
  '@angular/common/http': 'ng.common.http',
  '@angular/forms': 'ng.forms',
  '@angular/http': 'ng.http',
  '@angular/platform-browser': 'ng.platformBrowser',
  '@angular/platform-browser-dynamic': 'ng.platformBrowserDynamic',
  '@angular/platform-browser/animations': 'ng.platformBrowser.animations',
  // '@angular/platform-server': 'ng.platformServer',
  '@angular/router': 'ng.router',

};

/*const ROLLUP_COMMON_CONFIG = {
  sourceMap: true,
  rollup: require('rollup'),
  context: 'this',
  globals: ROLLUP_GLOBALS,
  external: Object.keys(ROLLUP_GLOBALS),
  plugins: [
    resolve({
      jsnext: true,
      main: true
    }),
  ],
};*/


// Local settings
let changedTestFiles = [];

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
    script: 'release/server.js',
    nodeArgs: [debugArgument],
    ext: 'js,html',
    verbose: true,
    watch: _.union(defaultAssets.server.views, defaultAssets.server.allJs, defaultAssets.server.config)
  });
});

// Nodemon task without verbosity or debugging
gulp.task('nodemon-nodebug', function () {
  return PLUGINS.nodemon({
    script: 'server.js',
    ext: 'js,html',
    watch: _.union(defaultAssets.server.views, defaultAssets.server.allJs, defaultAssets.server.config)
  });
});

gulp.task('clean', (cb) => {
  return del(["release"], cb);
});

gulp.task('tslint', () => {
  return gulp.src("src/**/*.ts")
    .pipe(PLUGINS.tslint({
        formatter: 'prose'
    }))
    .pipe(tslint.report());
});

gulp.task("compile", /*["tslint"],*/ () => {
  const tsResult = gulp.src("src/**/*.ts")
    .pipe(PLUGINS.sourcemaps.init())
    .pipe(tsProject());
  return tsResult.js
    .pipe(PLUGINS.sourcemaps.write(".", {sourceRoot: '/src'}))
    .pipe(gulp.dest("release"));
});

gulp.task("resources", () => {
  return gulp.src(["src/**/*", "!**/*.ts"])
    .pipe(gulp.dest("release"));
});

gulp.task("libs", () => {
  return gulp.src([
      'core-js/client/shim.min.js',
      'systemjs/dist/system-polyfills.js',
      'systemjs/dist/system.src.js',
      'reflect-metadata/Reflect.js',
      'rxjs/**',
      'zone.js/dist/**',
      '@angular/**'
  ], {cwd: "node_modules/**"}) /* Glob required here. */
    .pipe(gulp.dest("release/public"));
});

gulp.task('bump',() => {
  gulp.src(['./package.json'], {base: './'})
    .pipe(PLUGINS.bump({
      version: VERSION
    }))
    .pipe(gulp.dest('./'));
});


gulp.task('copy-sources', () => {
});
