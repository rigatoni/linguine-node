var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var del = require('del');
var watch = require('gulp-watch');
var less = require('gulp-less');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');


var paths = {
  scripts: ['assets/js/linguine.module.js', 'assets/js/corpora/corpora.module.js', 'assets/js/**/*.js'],
  stylesheets: 'assets/stylesheets/**/*.less'
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
})


gulp.task('watch', function(){
  watch(paths.scripts, function(files, cb){
    gulp.start('scripts-dev', cb);
  });
  watch(paths.stylesheets, function(files, cb){
    gulp.start('stylesheets', cb);
  });
});

gulp.task('test', function (cb) {
  gulp.src(['models/*.js', 'routes/*.js', 'app.js'])
    .pipe(istanbul())
    .on('finish', function () {
      return gulp.src(['tests/**/*_test.js'])
        .pipe(mocha())
        .pipe(istanbul.writeReports())
    });
});

gulp.task('build', ['scripts', 'stylesheets'])

gulp.task('default',['watch', 'scripts-dev', 'stylesheets']);
