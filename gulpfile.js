

// Requirements
// ============================================================================

var gulp        = require('gulp')
var cssnext     = require('gulp-cssnext')
var watch       = require('gulp-watch')
var browserify  = require('browserify')
var source      = require('vinyl-source-stream');
var buffer      = require('vinyl-buffer');
var uglify      = require('gulp-uglify')
var rename      = require('gulp-rename');


// Paths 
// ============================================================================

var rootPath = process.cwd() + '/app/app/static/';
var cssPath = rootPath + '/css/';
var jsPath =  rootPath + '/js/';


// Gulp Tasks
// ============================================================================

// Concatenate and process stylesheets with CSSNext
gulp.task('css', function() {
  gulp.src(cssPath + 'index.css')
    .pipe(cssnext())
    .pipe(rename('site.css'))
    .pipe(gulp.dest(rootPath))
});

// Concatenate and browserify JS sourcefiles.
gulp.task('js', function() {
  return  browserify(jsPath + 'index.js')
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(rootPath));
});

gulp.task('minify:js', ['js'], function() {
  return browserify(jsPath + 'index.js')
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(rootPath));
});

// Watch for changes and rerun tasks.
gulp.task('watch', function() {
  gulp.watch(cssPath + '*.css', ['css']);
  gulp.watch(jsPath + '*.js', ['js']);
});

// Register default tasks
gulp.task('develop', ['watch']);
gulp.task('production', ['minify:js']);
