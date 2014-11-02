var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var del = require('del');
var watch = require('gulp-watch');
var less = require('gulp-less');

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

gulp.task('stylesheets', function(){
  gulp.src(paths.stylesheets)
    .pipe(less())
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

gulp.task('build', ['scripts', 'stylesheets'])

gulp.task('default',['watch', 'build']);
