const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const rimraf = require('rimraf');

const plumber = require('gulp-plumber');

const ts = require('gulp-typescript');
const tsc = ts.createProject('./tsconfig.json');

const sass = require('gulp-dart-sass');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');

const webpack = require('webpack');
const stream = require('webpack-stream');
const webpackConfig = require('./webpack.config');

gulp.task('Command', () => {
  return gulp.src(['src/Command/**/*.ts'], {
    since: gulp.lastRun('Command')
  })
    .pipe(plumber())
    .pipe(tsc())
    .pipe(gulp.dest('dist/Command'));
});

gulp.task('Container', () => {
  return gulp.src(['src/Container/**/*.ts'], {
    since: gulp.lastRun('Container')
  })
    .pipe(plumber())
    .pipe(tsc())
    .pipe(gulp.dest('dist/Container'));
});

gulp.task('Controller', () => {
  return gulp.src(['src/Controller/**/*.ts'], {
    since: gulp.lastRun('Controller')
  })
    .pipe(plumber())
    .pipe(tsc())
    .pipe(gulp.dest('dist/Controller'));
});

gulp.task('Entity', () => {
  return gulp.src(['src/Entity/**/*.ts'], {
    since: gulp.lastRun('Entity')
  })
    .pipe(plumber())
    .pipe(tsc())
    .pipe(gulp.dest('dist/Entity'));
});

gulp.task('Factory', () => {
  return gulp.src(['src/Factory/**/*.ts'], {
    since: gulp.lastRun('Factory')
  })
    .pipe(plumber())
    .pipe(tsc())
    .pipe(gulp.dest('dist/Factory'));
});

gulp.task('Frontend', () => {
  return gulp.src(['src/Frontend/**/*.ts', 'src/Frontend/**/*.tsx'])
    .pipe(plumber())
    .pipe(stream(webpackConfig, webpack))
    .pipe(gulp.dest('dist/Server/public/js'));
});

gulp.task('Infrastructure', () => {
  return gulp.src(['src/Infrastructure/**/*.ts'], {
    since: gulp.lastRun('Infrastructure')
  })
    .pipe(plumber())
    .pipe(tsc())
    .pipe(gulp.dest('dist/Infrastructure'));
});

gulp.task('Interactor', () => {
  return gulp.src(['src/Interactor/**/*.ts'], {
    since: gulp.lastRun('Interactor')
  })
    .pipe(plumber())
    .pipe(tsc())
    .pipe(gulp.dest('dist/Interactor'));
});

gulp.task('Query', () => {
  return gulp.src(['src/Query/**/*.ts'], {
    since: gulp.lastRun('Query')
  })
    .pipe(plumber())
    .pipe(tsc())
    .pipe(gulp.dest('dist/Query'));
});

gulp.task('Server', () => {
  return gulp.src(['src/Server/**/*.ts'], {
    since: gulp.lastRun('Server')
  })
    .pipe(plumber())
    .pipe(tsc())
    .pipe(gulp.dest('dist/Server'));
});

gulp.task('Service', () => {
  return gulp.src(['src/Service/**/*.ts'], {
    since: gulp.lastRun('Service')
  })
    .pipe(plumber())
    .pipe(tsc())
    .pipe(gulp.dest('dist/Service'));
});

gulp.task('Transaction', () => {
  return gulp.src(['src/Transaction/**/*.ts'], {
    since: gulp.lastRun('Transaction')
  })
    .pipe(plumber())
    .pipe(tsc())
    .pipe(gulp.dest('dist/Transaction'));
});

gulp.task('VO', () => {
  return gulp.src(['src/VO/**/*.ts'], {
    since: gulp.lastRun('VO')
  })
    .pipe(plumber())
    .pipe(tsc())
    .pipe(gulp.dest('dist/VO'));
});

gulp.task('pug', () => {
  return gulp.src(['src/Server/views/*.pug'])
    .pipe(gulp.dest('dist/Server/views'));
});

gulp.task('sass', () => {
  return gulp.src(['src/Server/sass/*.scss'])
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer({
      'overrideBrowserslist': [
        'last 2 major versions'
      ]
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/Server/public/css'));
});

gulp.task('favicon', () => {
  return gulp.src(['src/Server/*.ico'])
    .pipe(gulp.dest('dist/Server'));
});

gulp.task('font', () => {
  return gulp.src(['node_modules/@fortawesome/fontawesome-free/webfonts/*'])
    .pipe(gulp.dest('dist/Server/public/webfonts'));
});

gulp.task('nodemon', (callback) => {
  let started = false;
  return nodemon({
    script: 'dist/Server/Server.js',
    watch: [
      'dist/**/*.js'
    ],
    ext: 'js',
    exec: 'node',
    stdout: true,
    delay: 500,
    env: {
      'NODE_ENV': 'development'
    }
  }).on('start', () => {
    if(!started) {
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
    'Command',
    'Container',
    'Controller',
    'Entity',
    'Factory',
    'Frontend',
    'Infrastructure',
    'Interactor',
    'Query',
    'Server',
    'Service',
    'Transaction',
    'VO'
  )
);

gulp.task(
  'default',
  gulp.parallel(
    'nodemon',
    (callback) => {
      gulp.watch('src/Command/**/*.ts', gulp.series('Command'));
      gulp.watch('src/Container/**/*.ts', gulp.series('Container'));
      gulp.watch('src/Controller/**/*.ts', gulp.series('Controller'));
      gulp.watch('src/Entity/**/*.ts', gulp.series('Entity'));
      gulp.watch('src/Factory/**/*.ts', gulp.series('Factory'));
      gulp.watch('src/Infrastructure/**/*.ts', gulp.series('Infrastructure'));
      gulp.watch('src/Interactor/**/*.ts', gulp.series('Interactor'));
      gulp.watch('src/Query/**/*.ts', gulp.series('Query'));
      gulp.watch('src/Server/**/*.ts', gulp.series('Server'));
      gulp.watch('src/Service/**/*.ts', gulp.series('Service'));
      gulp.watch('src/Transaction/**/*.ts', gulp.series('Transaction'));
      gulp.watch('src/VO/**/*.ts', gulp.series('VO'));
      gulp.watch('src/Server/views/*.pug', gulp.series('pug'));
      gulp.watch('src/Server/sass/*.scss', gulp.series('sass'));
      callback();
    }
  )
);
