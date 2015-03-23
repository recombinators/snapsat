var gulp                = require('gulp')
var postcss             = require('gulp-postcss')
var autoprefixer        = require('autoprefixer-core')
var atImport            = require('postcss-import')
var customProperties    = require('postcss-custom-properties')
var fontVariants        = require('postcss-font-variant')
var customMedia         = require('postcss-custom-media')
var rename              = require('gulp-rename')
var minify              = require('gulp-minify-css')
var watch               = require('gulp-watch')


// Concatenate and postprocess css sourcefiles.
gulp.task('css', function() {
    var processors = [
        atImport(),
        fontVariants(),
        autoprefixer({ browsers: ['last 3 versions']}),
        customProperties(),
        customMedia()
    ];
    return gulp.src('./src/index.css')
        .pipe(postcss(processors))
        .pipe(rename('main.css'))
        .pipe(gulp.dest('../'))
        .pipe(minify())
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('../'))
});


// Rebuild css on changes to sourcefiles.
gulp.task('watch', function() {
    gulp.watch('./src/*.css', ['css']);
});


gulp.task('default', ['watch'])
