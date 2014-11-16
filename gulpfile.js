var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var del = require('del');
var watch = require('gulp-watch');
var less = require('gulp-less');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');
var karma = require('karma').server;


var paths = {
  scripts: ['assets/js/linguine.module.js', 'assets/js/corpora/corpora.module.js', 'assets/js/analysis/analysis.module.js', 'assets/js/**/*.js'],
  stylesheets: 'assets/stylesheets/**/*.less',
  images: 'assets/img/*'
}

gulp.task('clean', function(cb){
  del(['public/js', 'public/css'], cb);
});

gulp.task('scripts', function(){
  gulp.src(paths.scripts)
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest('public/js'));
});

gulp.task('scripts-dev', function(){
  gulp.src(paths.scripts)
    .pipe(ngAnnotate())
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest('public/js'));
});

gulp.task('stylesheets', function(){
  gulp.src(paths.stylesheets)
    .pipe(less())
    .pipe(gulp.dest('public/css'));
});

gulp.task('images', function() {
  gulp.src(paths.images)
    .pipe(gulp.dest('public/img'));
});


gulp.task('watch', function(){
  watch(paths.scripts, function(files, cb){
    gulp.start('scripts-dev', cb);
  });
  watch(paths.stylesheets, function(files, cb){
    gulp.start('stylesheets', cb);
  });
});

gulp.task('mocha', function () {
  gulp.src(['models/*.js', 'routes/*.js', 'app.js'])
    .pipe(istanbul())
    .on('finish', function () {
      gulp.src(['test/**/*.js', '!test/angular/**/*.js'])
        .pipe(mocha())
        .pipe(istanbul.writeReports())
    });
});

/**
 * Run test once and exit
 */
gulp.task('karma', ['mocha'], function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('test', ['mocha', 'karma']);

gulp.task('build', ['scripts', 'stylesheets', 'images'])

gulp.task('default',['watch', 'scripts-dev', 'stylesheets', 'images']);
