import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import csso from 'postcss-csso';
import del from 'del';
import rename from 'gulp-rename';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';
import squoosh from 'gulp-libsquoosh';
import svgmin from 'gulp-svgmin';
// import svgstore from 'gulp-svgstore';


// Clean
const clean = () => {
  return del('build');
};


// Copy
const copy = (done) => {
  gulp.src([
    'source/fonts/*.{woff2,woff}',
    'source/*.ico',
    'source/*.webmanifest',
  ], {
    base: 'source'
  })
    .pipe(gulp.dest('build'))
  done();
}


// HTML
const html = () => {
  return gulp.src('source/*.html')
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest('build'));
}


// Styles
export const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    // .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    // для тестирования сборки из папки source
    .pipe(gulp.dest('source/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}


// Scripts
const scripts = () => {
  return gulp.src('source/js/main.js')
  // .pipe(terser())
  // .pipe(rename('main.min.js'))
  // .pipe(gulp.dest('build/js'))
  // для тестирования сборки из папки source
  .pipe(gulp.dest('source/js'))
  ;
}


// Images
const optimizeImages = () => {
  return gulp.src('source/images/**/*.{jpg,png}')
  .pipe(squoosh())
  .pipe(gulp.dest('build/images'));
}

const copyImages = () => {
  return gulp.src('source/images/**/*.{jpg,png}')
  .pipe(gulp.dest('build/images'));
}


// SVG
const svg = () => {
  return gulp.src(['source/images/**/*.svg', 'source/images/svg-css/*.svg', 'source/images/svg-inline/*.svg'])
  .pipe(svgmin())
  .pipe(gulp.dest('build/images'));
}


// Server
const server = (done) => {
  browser.init({
    server: {
      // baseDir: 'build'
      // для тестирования сборки из папки source
      baseDir: 'source'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}


// Watcher
const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/*.html').on('change', browser.reload);
  gulp.watch('source/js/*.js', gulp.series(scripts));
}


// Build
export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    html,
    styles,
    scripts,
    svg,
  )
);


// Source
export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    html,
    styles,
    scripts,
    svg,
  ),
  gulp.series (
    server,
    watcher
  ));
