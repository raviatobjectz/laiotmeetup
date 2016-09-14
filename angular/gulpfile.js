var gulp = require('gulp');
var browserSync = require('browser-sync').create();

gulp.task('watch-files', function() {
  gulp.watch('./index.html',['page-reload']);
  gulp.watch('./app.js',['page-reload']);
});

gulp.task('page-reload', function() {
  browserSync.reload();
})

gulp.task('browser-sync', ['watch-files'], function() {
  browserSync.init({
      server: "./"
  });
  browserSync.stream();
});

gulp.task('default', ['browser-sync']);
