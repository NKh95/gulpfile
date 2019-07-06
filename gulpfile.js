const PREPROCESSOR_TYPE='scss';

const gulp         =  require('gulp')                   ;
const sourcemaps   =  require("gulp-sourcemaps")        ;
const sass         =  require('gulp-sass')              ;
const concat       =  require("gulp-concat")            ;
const cleanCSS     =  require("gulp-clean-css")         ;
const debug        =  require("gulp-debug")             ;
const autoprefixer =  require('gulp-autoprefixer')      ;
const htmlmin      =  require('gulp-htmlmin')           ;
const uglify       =  require('gulp-uglify-es').default ;
const browserSync  =  require('browser-sync').create()  ;
const normalize    =  require('node-normalize-scss')    ;
const size         =  require('gulp-filesize')          ;
const del          =  require('del')                    ;

var app = {
        dir:   './app/',
    	css:   'css/**/*.css',
    	sass:  PREPROCESSOR_TYPE + '/**/*.' + PREPROCESSOR_TYPE,
        html:  '*.html',
        js:    'js/**/*.js',
        img:   'img/**/*.*',
        fonts: 'fonts/**/*.*'
    };
 
var build = {
        dir:   './dist/',
        css:   'css',
        js:    'js',
        img:   'img',
        fonts: 'fonts'
    };

gulp.task('default', gulp.series(html, style, js, BrowserSync));
gulp.task('style', style);
gulp.task('build', gulp.series(cleanDist, dist));
gulp.task('view', viewDist);

function BrowserSync(){
    browserSync.init({
        server: app.dir
    })

    gulp.watch(app.dir + app.html, gulp.series(html));
    gulp.watch(app.dir + app.sass, gulp.series(style));
    gulp.watch(app.dir + app.css).on('change', browserSync.reload);
    gulp.watch(app.dir + app.js, gulp.series(js));
}

function style(){
   return gulp.src(app.dir + app.sass)
        .pipe(size())
        .pipe(sourcemaps.init())
        .pipe(sass({ includePaths: normalize.includePaths }).on('error', sass.logError))
        .pipe(debug({title: PREPROCESSOR_TYPE}))
        .pipe(concat('common.css'))
        .pipe(debug({title: 'concat'}))
        .pipe(sourcemaps.write('map'))
        .pipe(gulp.dest(app.dir + 'css'))
        .pipe(size())
        .pipe(browserSync.stream());
}

function html(){
    return pipes(app.dir + app.html, 'html');
}

function js(){
    return pipes(app.dir + app.js, 'js');
}

function pipes(gulpSrc, debugTitle){
    return gulp.src(gulpSrc)
        .pipe(debug({title: debugTitle}))
        .pipe(size())
        .pipe(browserSync.stream());
}

function dist(done){
    gulp.src(app.dir + app.html)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(size())
        .pipe(gulp.dest(build.dir));

    gulp.src(app.dir + app.css)
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(size())
        .pipe(gulp.dest(build.dir + build.css));

    gulp.src(app.dir + app.js)
        .pipe(uglify())
        .pipe(size())
        .pipe(gulp.dest(build.dir + build.js));

    gulp.src(app.dir + app.img)
        .pipe(gulp.dest(build.dir + build.img));

    gulp.src(app.dir + app.fonts)
        .pipe(gulp.dest(build.dir + build.fonts));
        
    done();
}

function viewDist() {
    browserSync.init({
        server: build.dir
    });
}

function cleanDist() {
  return del([build.dir]);
}