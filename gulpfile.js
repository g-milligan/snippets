var minifyCode=false;

var jsFileOrder=['entity_list_container.js','ajax.js'];

var preJsPath='pre_res/js/';
var preCssPath='pre_res/css/';

//add preJsPath before each of the js files
for(var j=0;j<jsFileOrder.length;j++){jsFileOrder[j]='./'+preJsPath+jsFileOrder[j];}

/*
note: to install additional required node plugins run command

  FORMAT:
    npm install gulp {plugin-name} --save-dev
  EXAMPLE:
    npm install gulp gulp-concat --save-dev

*/
var gulp = require('gulp');
var fs = require('fs');
var concat = require('gulp-concat'); //npm install gulp gulp-concat --save-dev
var sass = require('gulp-sass'); //npm install gulp gulp-sass --save-dev
var uglify = require('gulp-uglify'); //npm install gulp gulp-uglify --save-dev
var browserSync = require('browser-sync'); //npm install gulp browser-sync --save-dev
var nodemon = require('gulp-nodemon'); //npm install gulp gulp-nodemon --save-dev

//gulp.task('reload',function(){browserSync.reload();});

gulp.task('scripts', function() {
  var g=gulp.src(jsFileOrder)
    .pipe(concat('app.js'));
  if(minifyCode){g=g.pipe(uglify());}
  return g.pipe(gulp.dest('./res/js/'));
});

gulp.task('styles', function() {
  var sassStyle='expanded', sassComments=true;
  if(minifyCode){
    sassStyle='compressed'; sassComments=false;
  }
  return gulp.src(preCssPath+'*.scss')
    .pipe(
      sass({outputStyle:sassStyle,sourceComments:sassComments})
      .on('error', sass.logError)
    )
    .pipe(gulp.dest("./res/css/"));
});

//server task
gulp.task('watch', function() {
  //watch files for changes
  gulp.watch(preJsPath+'*.js', ['scripts']);
  gulp.watch(preCssPath+'*.scss', ['styles']);
});

gulp.task('demon', function () {
  setTimeout(function(){
    nodemon({
      script: 'server.js',
      ext: preJsPath+'*.js '+preCssPath+'*.scss',
      env: {
        'NODE_ENV': 'development'
      }
    })
    .on('start', ['watch'])
    .on('change', ['watch'])
    .on('restart', function () {
      console.log('restarted!');
    });
  },700);
});

//the default action will open a browser window for the index.html file
gulp.task('default', ['scripts','styles','demon']);
