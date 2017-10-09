var gulp = require('gulp');

var inject = require('gulp-inject');

var bump = require('gulp-bump');

var concat   = require('gulp-concat');

var pkg = require('./package.json');

var changed = require('gulp-changed');

var revManifest = require('gulp-revmanifest');
var filelist = require('gulp-filelist');


const rev = require('gulp-rev');
const debug = require('gulp-debug');
const logCapture = require('gulp-log-capture');


var htmlclean = require('gulp-htmlclean');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var newer = require('gulp-newer');
var filelog = require('gulp-filelog');

var info = {};

info.build = {
    css : 'build/css/',
    js   : 'build/js/',
};

info.dest = {
    css : 'dist/css/',
    js   : 'dist/js/',
};

var paths = {
  src: 'src/**/*',
  srcHTML: 'src/**/*.html',
  srcCSS: 'src/**/*.css',
  srcJS: 'src/**/*.js',
  build: 'build',
  buildIndex: 'build/index.html',
  buildCSS: 'build/**/*.css',
  buildJS: 'build/**/*',
  dist: 'dist',
  distIndex: 'dist/index.html',
  distCSS: 'dist/**/*.css',
  distJS: 'dist/**/*.js'
};

gulp.task('html', function () {
  return gulp.src(paths.srcHTML).pipe(changed(paths.build)).pipe(filelog()).pipe(gulp.dest(paths.build)).pipe(gulp.dest(paths.dist));
});

gulp.task('css', function () {
  return gulp.src(paths.srcCSS).pipe(changed(paths.build)).pipe(filelist('filelist.json')).pipe(gulp.dest(paths.build)).pipe(gulp.dest(paths.dist));
});

gulp.task('js', function () {
//gulp.src(paths.srcJS).pipe(gulp.dest(paths.build));  
//return gulp.src(paths.srcJS).pipe(changed('dist')).pipe(concat('all-' + pkg.version + '.js')).pipe(gulp.dest(info.dest.js));
return gulp.src(paths.srcJS).pipe(changed(paths.build)).pipe(filelog()).pipe(gulp.dest(paths.build)).pipe(gulp.dest(paths.dist));
//return gulp.src(paths.srcJS).pipe(changed('build')).pipe(rev()).pipe(gulp.dest(paths.build));

});

gulp.task('bump', function(){
  return gulp.src('./package.json').pipe(bump()).pipe(gulp.dest('./'));
});

gulp.task('copy', ['html', 'css', 'js']);

gulp.task('inject', ['copy'], function () {
  var css = gulp.src(paths.buildCSS);
  var js = gulp.src(paths.buildJS);
  return gulp.src(paths.buildIndex)
    .pipe(inject( css, { relative:true } ))
    .pipe(inject( js, { relative:true } ))
    .pipe(gulp.dest(paths.build));
});

gulp.task('html:dist', function () {
  return gulp.src(paths.srcHTML).pipe(changed('dist')).pipe(gulp.dest(paths.dist));
});

gulp.task('css:dist', function () {
  return gulp.src(paths.srcCSS).pipe(concat('style.min.css')).pipe(cleanCSS()).pipe(gulp.dest(info.dest.css));
});
gulp.task('js:dist', function () {
  return gulp.src(paths.srcJS).pipe(concat('script.min.js')).pipe(uglify()).pipe(gulp.dest(info.dest.js));
});
gulp.task('copy:dist', ['html:dist', 'css:dist', 'js:dist']);

gulp.task('inject:dist', ['copy:dist'], function () {
  var css = gulp.src(paths.distCSS);
  var js = gulp.src(paths.distJS);
  return gulp.src(paths.distIndex).pipe(inject( css, { relative:true } )).pipe(inject( js, { relative:true } )).pipe(gulp.dest(paths.dist));
});

gulp.task('build', ['inject:dist']);


gulp.task('default', function () {
  console.log('Hello World!');
});