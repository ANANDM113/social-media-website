const gulp  =   require('gulp');
const cssnano   =   require('gulp-cssnano');
const rev   =   require('gulp-rev');

gulp.task('css',function(){
    console.log('minifying css...');
    gulp.src('./assets/css/**/*.css')
    .pipe(cssnano())
    .pipe(gulp.dest('./assets.css'));

    return gulp.src('./assets/**/*.css')
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public', //current working directory
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
})