"use strict"

const stylesheetSyntax='scss';

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
const separator = '____________________________________';

let app = {
        dir:   './src/',
    	css:   'css/**/*.css',
    	sass:  stylesheetSyntax + '/**/*.' + stylesheetSyntax,
        html:  '*.html',
        js:    'js/**/*.js',
        img:   'img/**/*.*',
        fonts: 'fonts/**/*.*'
    };
 
let build = {
        dir:   './dist/',
        css:   'css',
        js:    'js',
        img:   'img',
        fonts: 'fonts'
    };

const html = otherTasks(app.dir + app.html, 'html');
const js = otherTasks(app.dir + app.js, 'js');
const css = otherTasks(app.dir + app.css, 'css');

//run tasks
gulp.task('default', gulp.series(html, (stylesheetSyntax != 'css') ? SassPreprocessorTasks : css, js, BrowserSync));
gulp.task('style', SassPreprocessorTasks);
gulp.task('build', gulp.series(cleanDist, dist));
gulp.task('view', viewDist);

//function tasks
function BrowserSync(){
    browserSync.init({
        server: app.dir
    })

    if(stylesheetSyntax != 'css'){
        gulp.watch(app.dir + app.sass, gulp.series(SassPreprocessorTasks));
        gulp.watch(app.dir + app.css).on('change', browserSync.reload);
    }else{
        gulp.watch(app.dir + app.css, gulp.series(css));
    }

    gulp.watch(app.dir + app.html, gulp.series(html));
    gulp.watch(app.dir + app.js, gulp.series(js));
}

function SassPreprocessorTasks(){
    console.log(`${separator} \n\n ${stylesheetSyntax} \n`);
    return gulp.src(app.dir + app.sass)
        .on('end', () => { console.log(' ') })
        .pipe(size())
        .pipe(debug({title: 'File'}))
        .pipe(sourcemaps.init())
        .pipe(sass({ includePaths: normalize.includePaths }).on('error', sass.logError))
        .pipe(sourcemaps.write('map'))
        .pipe(gulp.dest(app.dir + 'css'))
        .pipe(browserSync.stream());

}

function  otherTasks(gulpSrc, title){
    return tasks;

    function tasks(){
        console.log(`${separator} \n\n ${title} \n`);
        return gulp.src(gulpSrc)
            .on('end', () => { console.log(' ') })
            .pipe(size())
            .pipe(debug({title: 'File'}))
            .pipe(browserSync.stream());
    }
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