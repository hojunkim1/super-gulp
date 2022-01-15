import del from "del";
import { dest, parallel, series, src, watch } from "gulp";
import GulpPug from "gulp-pug";
import dartSass from "sass";
import gulpSass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import csso from "gulp-csso";
import webserver from "gulp-webserver";

const sass = gulpSass(dartSass);

const routes = {
  pug: {
    watch: "src/**/*.pug",
    src: "src/*.pug",
    dist: "build",
  },
  styles: {
    watch: "src/scss/**/*.scss",
    src: "src/scss/style.scss",
    dist: "build/styles",
  },
};

// Tasks

const clean = () => del(["build"]);

const devServer = () =>
  src("build").pipe(webserver({ livereload: true, open: true }));

const pug = () =>
  src(routes.pug.src).pipe(GulpPug()).pipe(dest(routes.pug.dist));

const styles = () =>
  src(routes.styles.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(csso())
    .pipe(dest(routes.styles.dist));

const watchNew = () => {
  watch(routes.pug.watch, pug);
  watch(routes.styles.watch, styles);
};

// Export

const prepare = series(clean);
const assets = series(pug, styles);
const post = parallel(devServer, watchNew);

export const dev = series(prepare, assets, post);
