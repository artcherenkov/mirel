const gulp = require('gulp');
const rename = require('gulp-rename');
const server = require("browser-sync").create();
const del = require("del");

const sass = require('gulp-sass');
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sourcemap = require("gulp-sourcemaps");
const cleanCSS = require('gulp-clean-css');

const htmlmin = require('gulp-htmlmin');

const paths = {
  styles: {
    dev: './src/sass/**/*.scss',
    src: './src/sass/styles.scss',
    dest: './build/css'
  }
};

gulp.task("clean", function () {
  return del("build");
})

gulp.task("copy", function () {
  return gulp.src([
    "src/fonts/**/*.{woff,woff2}",
    "src/img/**",
    "src/js/**",
    "src/*.ico"
  ], {
    base: "src"
  })
    .pipe(gulp.dest("build"));
})

gulp.task("styles", function () {
  return gulp.src(paths.styles.src)
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest("src/css"))
    .pipe(gulp.dest("build/css"))
    .pipe(cleanCSS())
    .pipe(rename(`styles.min.css`))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
})

gulp.task("html", function () {
  return gulp.src("src/*.html")
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest("build"));
})

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: false,
    cors: true,
    ui: false
  });

  gulp.watch(paths.styles.dev, gulp.series("styles"));
  gulp.watch("src/**/*.js", gulp.series("copy", "refresh"));
  gulp.watch("src/**/*.html", gulp.series("html", "refresh"));
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
})

gulp.task("build", gulp.series(
  "clean",
  "copy",
  "styles",
  "html"
));

gulp.task("start", gulp.series("build", "server"));

const ghPages = require('gh-pages');
gulp.task('deploy', function() {
  ghPages.publish('./build', {}, function(err) {});
});
