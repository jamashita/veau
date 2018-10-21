'use strict';

const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const runSequence = require('run-sequence');
const rimraf = require('rimraf');

const plumber = require('gulp-plumber');
const cache = require('gulp-cached');
const watch = require('gulp-watch');

const ts = require('gulp-typescript');
const tsc = ts.createProject('./tsconfig.json');

const sass = require('gulp-sass');
const cssComb = require('gulp-csscomb');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
//
// const webpack = require('webpack');
// const stream = require('webpack-stream');
// const webpackConfig = require('./webpack.config');

gulp.task('veau-controller', () => {
  return gulp.src(['src/veau-controller/**/*.ts'])
    .pipe(plumber())
    .pipe(cache('controller'))
    .pipe(tsc())
    .pipe(gulp.dest('dist/veau-controller'));
});

gulp.task('veau-server', () => {
  return gulp.src(['src/veau-server/**/*.ts'])
    .pipe(plumber())
    .pipe(cache('server'))
    .pipe(tsc())
    .pipe(gulp.dest('dist/veau-server'));
});

gulp.task('pug', () => {
  return gulp.src(['src/veau-server/views/*.pug'])
    .pipe(gulp.dest('dist/veau-server/views'));
});

gulp.task('sass', () => {
  return gulp.src(['src/veau-server/sass/*.scss'])
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer({
      'browsers': ['last 4 versions']
    }))
    .pipe(cssComb())
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/veau-server/public/css'));
});

gulp.task('favicon', () => {
  return gulp.src(['src/veau-server/*.ico'])
    .pipe(gulp.dest('dist/veau-server'));
});

gulp.task('font', () => {
  return gulp.src(['node_modules/font-awesome/fonts/*'])
    .pipe(gulp.dest('dist/veau-server/public/fonts'));
});

gulp.task('nodemon', (callback) => {
  let started = false;
  return nodemon({
    script: 'dist/veau-server/index.js',
    watch: ['dist/**/*.js'],
    ext: 'js',
    stdout: true,
    delay: 500,
    env: {
      'NODE_ENV': 'development'
    }
  }).on('start', () => {
    if (!started) {
      callback();
      started = true;
    }
  }).on('restart', () => {
    console.log('SERVER RESTARTED');
  });
});

gulp.task('clean', (callback) => {
  rimraf('dist', callback);
});

gulp.task('dev', (callback) => {
  runSequence(
    'clean',
    [
      'pug',
      'sass',
      'favicon',
      'font'
    ],
    'veau-controller',
    'veau-server',
    callback
  );
});

gulp.task('build', (callback) => {
  runSequence(
    'clean',
    [
      'pug',
      'sass',
      'favicon',
      'font'
    ],
    'veau-controller',
    'veau-server',
    callback
  );
});

gulp.task('default', ['nodemon'], () => {
  watch('src/veau-controller/**/*.ts', {usePolling: true}, () => {
    gulp.start('veau-controller');
  });
  // watch('src/veau-domain/**/*.ts', {usePolling: true}, () => {
  //   gulp.start('veau-domain');
  // });
  // watch('src/veau-factory/**/*.ts', {usePolling: true}, () => {
  //   gulp.start('veau-factory');
  // });
  // watch('src/veau-general/**/*.ts', {usePolling: true}, () => {
  //   gulp.start('veau-general');
  // });
  // watch('src/veau-infrastructure/**/*.ts', {usePolling: true}, () => {
  //   gulp.start('veau-infrastructure');
  // });
  // watch('src/veau-repository/**/*.ts', {usePolling: true}, () => {
  //   gulp.start('veau-repository');
  // });
  watch('src/veau-server/**/*.ts', {usePolling: true}, () => {
    gulp.start('veau-server');
  });
  // watch('src/veau-service/**/*.ts', {usePolling: true}, () => {
  //   gulp.start('veau-service');
  // });
  // watch('src/veau-usecase/**/*.ts', {usePolling: true}, () => {
  //   gulp.start('veau-usecase');
  // });
  watch('src/veau-server/views/*.pug', {usePolling: true}, () => {
    gulp.start('pug');
  });
  watch('src/veau-server/sass/*.scss', {usePolling: true}, () => {
    gulp.start('sass');
  });
});
