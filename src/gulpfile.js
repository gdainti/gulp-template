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
    del = require('del'),
    gulpif = require('gulp-if'),
    merge = require('merge-stream'),
    spritesmith = require("gulp.spritesmith");

var paths = {
    src: {
        scripts: 'js/*.js',
        styles: 'less/**/*.less',
        mainLess: 'less/_style.less',
        images: 'images/**/*.{png,jpg}',
        sprites: 'images/sprites/*.{png,jpg}'
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
        .pipe(rename({suffix: '.min'}))
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
        .pipe(rename({
           basename: 'style',
           suffix: '.min'
        }))
        .pipe(gulp.dest(paths.public.styles))
        .pipe(livereload());
});

gulp.task('images', function(){
    return gulp.src([paths.src.images, '!images/{sprites,sprites/**}'])
        .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
        .pipe(gulp.dest(paths.public.images))
        .pipe(livereload());
});

gulp.task('sprites', function () {
    var spriteData = gulp.src(paths.src.sprites)
        .pipe(imagemin())
        .pipe(spritesmith({
            imgPath: '/images/_sprite.png',
            imgName: '_sprite.png',
            cssName: 'sprite.less'
        }));
    var imgStream = spriteData.img
        .pipe(gulp.dest(paths.public.images));
    var cssStream = spriteData.css
        .pipe(gulp.dest('less'));

    return merge(imgStream, cssStream);
});

gulp.task('clean', function(cb) {
    del(paths.public.images, {force: true}, cb)
});

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(paths.src.scripts, ['scripts']);
    gulp.watch(paths.src.styles, ['styles']);
    gulp.watch(paths.src.sprites, ['sprites', 'styles']);
    gulp.watch(paths.src.images, ['images']);

});

gulp.task('default', ['clean', 'images', 'sprites', 'styles', 'scripts',  'watch']);