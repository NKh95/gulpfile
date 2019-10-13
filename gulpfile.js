/*
*   GULPFILE BY N.Kh.
*   Link: https://github.com/NKh95/gulpfile_by_nkh.git
*   License: MIT License
*   Version: 1.0.8
*/

"use strict"

// config
const stylesheetSyntax= 'scss';
const gulpBabel= false;

// plugins
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
const babel        =  require('gulp-babel')             ;
const del          =  require('del')                    ;
const separator = '____________________________________';

// directories
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

// tasks
function watchFiles(){
    browserSync.init({
        server: app.dir
    })

    if(stylesheetSyntax != 'css'){
        gulp.watch(app.dir + app.sass, gulp.series(SassTask));
        gulp.watch(app.dir + app.css).on('change', browserSync.reload);
    }else{
        gulp.watch(app.dir + app.css, gulp.series(css));
    }

    gulp.watch(app.dir + app.html, gulp.series(html));
    gulp.watch(app.dir + app.js, gulp.series(javaScript));
}

function SassTask(){
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

function  commonTask(gulpSrc, title){
    return task;

    function task(){
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

   if(gulpBabel == true){
        gulp.src(app.dir + app.js)
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(size())
        .pipe(gulp.dest(build.dir + build.js));

    }else{
        gulp.src(app.dir + app.js)
        .pipe(uglify())
        .pipe(size())
        .pipe(gulp.dest(build.dir + build.js));
    }

    gulp.src(app.dir + app.img)
        .pipe(gulp.dest(build.dir + build.img));

    gulp.src(app.dir + app.fonts)
        .pipe(gulp.dest(build.dir + build.fonts));
        
    done();
}

function testDist(){
    browserSync.init({
        server: build.dir
    });
}

function cleanDist(){
  return del([build.dir] + "/*");
}

// define complex tasks
const html = commonTask(app.dir + app.html, 'html');
const css = commonTask(app.dir + app.css, 'css');
const javaScript = commonTask(app.dir + app.js, 'js');

const building = gulp.series(cleanDist, dist);
const dev = gulp.series( watchFiles, html, (stylesheetSyntax != 'css') ? SassTask : css, javaScript);

// export tasks
exports.default = dev;
exports.style = SassTask;
exports.build = building;
exports.test = testDist;
exports.clean = cleanDist;