var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    livereload = require('gulp-livereload'),
    sourcemaps = require('gulp-sourcemaps'),
    postcss = require('gulp-postcss'),
    csswring = require('csswring'),
    imagemin   = require('gulp-imagemin'),
    cache   = require('gulp-cache'),
    del = require('del');

var paths = {
    src: {
        scripts: 'js/*.js',
        styles: 'less/**/*.less',
        mainLess: 'less/style.less',
        images: 'images/**/*.*'
    },
    public: {
        scripts: '../public/js',
        styles: '../public/css',
        images: '../public/images'
    }
};

gulp.task('scripts', function(){
    gulp.src(paths.src.scripts)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat("script.js"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.public.scripts))
        .pipe(livereload());
});

gulp.task('styles', function() {
    gulp.src(paths.src.mainLess)
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer('last 2 version'))
        .pipe(postcss([csswring]))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.public.styles))
        .pipe(livereload());
});

gulp.task('clean', function(cb) {
    del([paths.public.scripts, paths.public.styles, paths.public.images], {force: true}, cb)
});

gulp.task('images', ['clean'], function(){
    return gulp.src(paths.src.images)
        .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
        .pipe(gulp.dest(paths.public.images));
});


gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(paths.src.scripts, ['scripts']);
    gulp.watch(paths.src.styles, ['styles']);
    gulp.watch(paths.src.images, ['images']);
});

gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images', 'watch');
});







