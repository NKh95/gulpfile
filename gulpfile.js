var PREPROCESSOR_TYPE='scss';

var
    gulp         =  require('gulp'),
    sourcemaps   =  require("gulp-sourcemaps"),
    sass         =  require('gulp-sass'),
    concat       =  require("gulp-concat"),
    cleanCSS     =  require("gulp-clean-css"),
    debug        =  require("gulp-debug"),
    autoprefixer =  require('gulp-autoprefixer'),
    htmlmin      =  require('gulp-htmlmin'),
    uglify       =  require('gulp-uglify'),
    browserSync  =  require('browser-sync').create(),
    normalize    =  require('node-normalize-scss');

var 
    app = {
        dir:   './app/',
    	css:   'css/**/*.css',
    	sass:  PREPROCESSOR_TYPE + '/**/*.' + PREPROCESSOR_TYPE,
        html:  '*.html',
        js:    'js/**/*.js',
        img:   'img/**/*.*',
        fonts: 'fonts/**/*.*'
    },
 
    build = {
        dir:   './dist/',
        css:   'css',
        js:    'js',
        img:   'img',
        fonts: 'fonts'
    };

gulp.task('default', gulp.series(style, BrowserSync));
gulp.task('style', style);
gulp.task('view', viewBuildResult);
gulp.task('build', dist);

function style(){
    return gulp.src(app.dir + app.sass)
        .pipe(sourcemaps.init())
        .pipe(sass({ includePaths: normalize.includePaths }).on('error', sass.logError))
        .pipe(debug({title: PREPROCESSOR_TYPE}))
        .pipe(debug({title: PREPROCESSOR_TYPE}))
        .pipe(concat("common.css"))
        .pipe(debug({title: "concat"}))
        .pipe(sourcemaps.write("map"))
        .pipe(gulp.dest(app.dir + 'css'))
        .pipe(browserSync.stream());
}

function BrowserSync(){
    browserSync.init({
        server: app.dir
    })

    gulp.watch(app.dir + app.js).on('change', browserSync.reload)
    gulp.watch(app.dir + app.css).on('change', browserSync.reload)
    gulp.watch(app.dir + app.sass, gulp.series(style))//.on('change', browserSync.reload)
    gulp.watch(app.dir + app.html).on('change', browserSync.reload);
}

function viewBuildResult() {
    browserSync.init({
        server: build.dir
    });
}

function dist(){
    gulp.src(app.dir + app.js)
        .pipe(uglify())
        .pipe(gulp.dest(build.dir + build.js));

    gulp.src(app.dir + app.html)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(build.dir));

    gulp.src(app.dir + app.css)
        .pipe(autoprefixer({
            browsers: ['last 6 versions'],
            cascade: false
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest(build.dir + build.css));

	gulp.src(app.dir + app.img)
    	.pipe(gulp.dest(build.dir + build.img));

    gulp.src(app.dir + app.fonts)
    	.pipe(gulp.dest(build.dir + build.fonts));
}