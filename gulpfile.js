var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var coffee = require('gulp-coffee');
var jade = require('gulp-jade');
var cp = require("child_process");
var paths = {
  sass: ['./www/sass/*.scss'],
  coffee: ['./www/coffee/*.coffee'],
  jade:['./www/jade/*.jade']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./www/sass/**.scss')
    .pipe(sass({ errLogToConsole: true}))
    .pipe(rename({ extname: '.css' }))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./www/css'))
    .on('end', done);
});

gulp.task('coffee', function(done) {
  
  var stream = gulp.src(paths.coffee)
    .pipe(coffee({bare: true})
      .on('error', gutil.log.bind(gutil, 'Coffee Error'))
    )
    .on('error',function(){
      cp.exec('say fail coffee');
      done();
    })
    .pipe(concat('application.js'))
    .pipe(gulp.dest('./www/js'))
    .on('end', done);

  stream.on("end",function(){
    cp.exec('say compiled coffee')
  });
})
gulp.task('jade',function(done){

  var stream = gulp.src(paths.jade)
    .pipe(jade({pretty:true})
      .on('error',gutil.log.bind(gutil,'Jade Error'))
    ).on('error',function(){
      cp.exec('say fail Jade');
      done();
    })
    .pipe(gulp.dest('./www/templates'))
    .on('end',done)

  stream.on("end",function(){
    cp.exec('say compiled Jade')
  });
})
gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass'])
  gulp.watch(paths.coffee, ['coffee'])
  gulp.watch(paths.jade, ['jade'])
});
