const Gulp = require('gulp')
const sass = require('gulp-sass');

Gulp.task('default', ['scss', 'scss:watch']);

Gulp.task('prod', ['scss:prod']);

Gulp.task('scss', () => {
    Gulp.src('static/scss/**/*.scss')
        .pipe(sass({
            includePaths: ['node_modules/foundation-sites/scss']
        }).on('error', sass.logError))
        .pipe(Gulp.dest('static/css'));
});

Gulp.task('scss:prod', () => {
    Gulp.src('static/scss/**/*.scss')
        .pipe(sass({
            includePaths: ['node_modules/foundation-sites/scss'],
            outputStyle: 'compact'
        }).on('error', sass.logError))
        .pipe(Gulp.dest('static/css'));
});

Gulp.task('scss:watch', () => {
    Gulp.watch('static/scss/**/*.scss', ['scss']);
});
