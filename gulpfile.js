
// ========== Requirements ==========
var browserify          = require('browserify');
var source              = require('vinyl-source-stream');
var buffer              = require('vinyl-buffer');
var uglify              = require('gulp-uglify');
var gulp                = require('gulp');
var postcss             = require('gulp-postcss');
var autoprefixer        = require('autoprefixer-core');
var atImport            = require('postcss-import');
var customProperties    = require('postcss-custom-properties');
var fontVariants        = require('postcss-font-variant');
var customMedia         = require('postcss-custom-media');
var rename              = require('gulp-rename');
var minify              = require('gulp-minify-css');
var watch               = require('gulp-watch');

var rootPath = process.cwd() + '/app/app/static/';
var cssPath = rootPath + '/stylesheets/';
var jsPath =  rootPath + '/js/';

console.log(rootPath);

// ========== Gulp tasks ==========
//
// Concatenate and build css source
gulp.task('css', function() {
    var processors = [
        atImport(),
        fontVariants(),
        autoprefixer({ browsers: ['last 3 versions']}),
        customProperties(),
        customMedia()
    ];
    return gulp.src(cssPath + 'index.css')
        .pipe(postcss(processors))
        .pipe(rename('main.css'))
        .pipe(gulp.dest(rootPath));
});


// Concatenate and browserify js source
gulp.task('js', function() {
    return browserify(jsPath + 'index.js')
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(rootPath));
});


// Rebuild css and js on changes to source
gulp.task('watch', function() {
    gulp.watch(cssPath + '*.css', ['css']);
    gulp.watch(jsPath + '*.js', ['js']);
});


// Minify css
gulp.task('minify:css', ['css'], function() {
    return gulp.src(rootPath + 'main.css')
        .pipe(minify())
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest(rootPath));
});

// Minify js
gulp.task('minify:js', ['js'], function() {
    return browserify(jsPath + 'index.js')
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest(rootPath));
});

// Register final tasks
gulp.task('develop', ['watch']);
gulp.task('production', ['minify:css', 'minify:js']);
