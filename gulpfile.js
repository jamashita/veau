'use strict';

const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const rimraf = require('rimraf');

const plumber = require('gulp-plumber');

const ts = require('gulp-typescript');
const tsc = ts.createProject('./tsconfig.json');

const sass = require('gulp-sass');
const cssComb = require('gulp-csscomb');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');

const webpack = require('webpack');
const stream = require('webpack-stream');
const webpackConfig = require('./webpack.config');

gulp.task('veau-collection', () => {
  return gulp.src(['src/veau-collection/**/*.ts'], {
    since : gulp.lastRun('veau-collection')
  })
    .pipe(plumber())
    .pipe(tsc())
    .pipe(gulp.dest('dist/veau-collection'));
});

gulp.task('veau-controller', () => {
  return gulp.src(['src/veau-controller/**/*.ts'], {
      since : gulp.lastRun('veau-controller')
    })
    .pipe(plumber())
    .pipe(tsc())
    .pipe(gulp.dest('dist/veau-controller'));
});

gulp.task('veau-entity', () => {
  return gulp.src(['src/veau-entity/**/*.ts'], {
      since : gulp.lastRun('veau-entity')
    })
    .pipe(plumber())
    .pipe(tsc())
    .pipe(gulp.dest('dist/veau-entity'));
});

gulp.task('veau-enum', () => {
  return gulp.src(['src/veau-enum/**/*.ts'], {
    since : gulp.lastRun('veau-enum')
  })
    .pipe(plumber())
    .pipe(tsc())
    .pipe(gulp.dest('dist/veau-enum'));
});

gulp.task('veau-factory', () => {
  return gulp.src(['src/veau-factory/**/*.ts'], {
      since : gulp.lastRun('veau-factory')
    })
    .pipe(plumber())
    .pipe(tsc())
    .pipe(gulp.dest('dist/veau-factory'));
});

gulp.task('veau-frontend', () => {
  return gulp.src(['src/veau-frontend/**/*.ts', 'src/veau-frontend/**/*.tsx'])
    .pipe(plumber())
    .pipe(stream(webpackConfig, webpack))
    .pipe(gulp.dest('dist/veau-server/public/js'));
});

gulp.task('veau-general', () => {
  return gulp.src(['src/veau-general/**/*.ts'], {
      since : gulp.lastRun('veau-general')
    })
    .pipe(plumber())
    .pipe(tsc())
    .pipe(gulp.dest('dist/veau-general'));
});

gulp.task('veau-infrastructure', () => {
  return gulp.src(['src/veau-infrastructure/**/*.ts'], {
      since : gulp.lastRun('veau-infrastructure')
    })
    .pipe(plumber())
    .pipe(tsc())
    .pipe(gulp.dest('dist/veau-infrastructure'));
});

gulp.task('veau-repository', () => {
  return gulp.src(['src/veau-repository/**/*.ts'], {
      since : gulp.lastRun('veau-repository')
    })
    .pipe(plumber())
    .pipe(tsc())
    .pipe(gulp.dest('dist/veau-repository'));
});

gulp.task('veau-server', () => {
  return gulp.src(['src/veau-server/**/*.ts'], {
      since : gulp.lastRun('veau-server')
    })
    .pipe(plumber())
    .pipe(tsc())
    .pipe(gulp.dest('dist/veau-server'));
});

gulp.task('veau-service', () => {
  return gulp.src(['src/veau-service/**/*.ts'], {
      since : gulp.lastRun('veau-service')
    })
    .pipe(plumber())
    .pipe(tsc())
    .pipe(gulp.dest('dist/veau-service'));
});

gulp.task('veau-usecase', () => {
  return gulp.src(['src/veau-usecase/**/*.ts'], {
      since : gulp.lastRun('veau-usecase')
    })
    .pipe(plumber())
    .pipe(tsc())
    .pipe(gulp.dest('dist/veau-usecase'));
});

gulp.task('veau-vo', () => {
  return gulp.src(['src/veau-vo/**/*.ts'], {
      since : gulp.lastRun('veau-vo')
    })
    .pipe(plumber())
    .pipe(tsc())
    .pipe(gulp.dest('dist/veau-vo'));
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
  return gulp.src(['node_modules/@fortawesome/fontawesome-free/webfonts/*'])
    .pipe(gulp.dest('dist/veau-server/public/webfonts'));
});

gulp.task('nodemon', (callback) => {
  let started = false;
  return nodemon({
    script: 'dist/veau-server/Server.js',
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

gulp.task(
  'build',
  gulp.series(
    'clean',
    gulp.parallel(
      'pug',
      'sass',
      'favicon',
      'font'
    ),
    'veau-collection',
    'veau-controller',
    'veau-entity',
    'veau-enum',
    'veau-factory',
    'veau-frontend',
    'veau-general',
    'veau-infrastructure',
    'veau-repository',
    'veau-server',
    'veau-service',
    'veau-usecase',
    'veau-vo'
  )
);

gulp.task(
  'default',
  gulp.parallel(
    'nodemon',
    (callback) => {
      gulp.watch('src/veau-collection/**/*.ts', gulp.series('veau-collection'));
      gulp.watch('src/veau-controller/**/*.ts', gulp.series('veau-controller'));
      gulp.watch('src/veau-entity/**/*.ts', gulp.series('veau-entity'));
      gulp.watch('src/veau-enum/**/*.ts', gulp.series('veau-enum'));
      gulp.watch('src/veau-factory/**/*.ts', gulp.series('veau-factory'));
      gulp.watch('src/veau-general/**/*.ts', gulp.series('veau-general'));
      gulp.watch('src/veau-infrastructure/**/*.ts', gulp.series('veau-infrastructure'));
      gulp.watch('src/veau-repository/**/*.ts', gulp.series('veau-repository'));
      gulp.watch('src/veau-server/**/*.ts', gulp.series('veau-server'));
      gulp.watch('src/veau-service/**/*.ts', gulp.series('veau-service'));
      gulp.watch('src/veau-usecase/**/*.ts', gulp.series('veau-usecase'));
      gulp.watch('src/veau-vo/**/*.ts', gulp.series('veau-vo'));
      gulp.watch('src/veau-server/views/*.pug', gulp.series('pug'));
      gulp.watch('src/veau-server/sass/*.scss', gulp.series('sass'));
      callback();
    }
  )
);
