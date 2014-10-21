var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var del = require('del');
var watch = require('gulp-watch')

var paths = {
  scripts: 'assets/js/**/*.js',
  stylesheets: 'assets/stylesheets/**/*.*'
}

gulp.task('clean', function(cb){
  del(['public/js', 'public/css'], cb);
});

gulp.task('scripts', ['clean'], function(){
  return gulp.src(paths.scripts)
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest('public/js'));
});

gulp.task('stylesheets', ['clean'], function(){
  return gulp.src(paths.scripts)
    //TODO: Decide on CSS Preprocesser
    .pipe(gulp.dest('public/css'));
})


gulp.task('watch', function(){
  watch(paths.scripts, function(files, cb){
    gulp.start('scripts', cb);
  });
  watch(paths.stylesheets, function(files, cb){
    gulp.start('stylesheets', cb);
  });
});

gulp.task('default',['watch', 'scripts']);
