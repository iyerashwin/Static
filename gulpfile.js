var gulp = require('gulp');

var inject = require('gulp-inject');

var bump = require('gulp-bump');

var concat   = require('gulp-concat');

var pkg = require('./package.json');

var changed = require('gulp-changed');

var revManifest = require('gulp-revmanifest');

const rev = require('gulp-rev');
const debug = require('gulp-debug');
const logCapture = require('gulp-log-capture');
const tar = require('gulp-tar');
const zip = require('gulp-zip');

var htmlclean = require('gulp-htmlclean');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var newer = require('gulp-newer');
var filelog = require('gulp-filelog');
var gzip = require('gulp-gzip');
var gulpSequence = require('gulp-sequence');


var info = {};

info.build = {
    css : 'build/css/',
    js   : 'build/js/',
};

info.dest = {
    css : 'dist/css/**',
    js   : 'dist/js/**',
};

var paths = {
  src: 'src/**/*',
  srcHTML: 'src/**/*.html',
  srcCSS: 'src/**/*.css',
  srcJS: 'src/**/*.js',
  build: 'build',
  buildIndex: 'build/index.html',
  buildCSS: 'build/**/*.css',
  buildJS: 'build/**/*.js',
  dist: 'dist',
  distIndex: 'dist/index.html',
  distCSS: 'dist/**/*.css',
  distJS: 'dist/**/*.js',
  target: 'target/',
  targetCSS: 'target/css/',
  targetjs: 'target/js/'
};

gulp.task('css', function () {
  return gulp.src(paths.srcCSS).pipe(gulp.dest(paths.build));
});

gulp.task('js', function () {
gulp.src(paths.srcJS).pipe(gulp.dest(paths.build));  
//return gulp.src(paths.srcJS).pipe(changed('dist')).pipe(concat('all-' + pkg.version + '.js')).pipe(gulp.dest(info.dest.js));
//return gulp.src(paths.srcJS).pipe(changed(paths.build)).pipe(filelog()).pipe(gulp.dest(paths.build)).pipe(gulp.dest(paths.dist));
//return gulp.src(paths.srcJS).pipe(changed('build')).pipe(rev()).pipe(gulp.dest(paths.build));

});

gulp.task('bump', function(){
  return gulp.src('./package.json').pipe(bump()).pipe(gulp.dest('./'));
});

gulp.task('copy', ['css', 'js']);

//For processed files (Minimize & Zip)
gulp.task('minimizecss', function() {
	return gulp.src(paths.buildCSS).pipe(cleanCSS()).pipe(gulp.dest(paths.dist));
});

gulp.task('minimizejs', function() {
	return gulp.src(paths.buildJS).pipe(uglify()).pipe(gulp.dest(paths.dist));
});

gulp.task('compresscss', function() {
	return gulp.src(info.dest.css).pipe(zip('css.zip')).pipe(gulp.dest(paths.target));
});

gulp.task('compressjs', function() {
	return gulp.src(info.dest.js).pipe(zip('js.zip')).pipe(gulp.dest(paths.target));
});

gulp.task('build', gulpSequence('copy', 'minimizecss','minimizejs','compresscss','compressjs'));


gulp.task('default', function () {
  console.log('Hello World!');
});
