import del from "del";
import { dest, parallel, series, src, watch } from "gulp";
import webserver from "gulp-webserver";
import GulpPug from "gulp-pug";
import dartSass from "sass";
import gulpSass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import csso from "gulp-csso";
import bro from "gulp-bro";
import babelify from "babelify";

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
  js: {
    watch: "src/js/**/*.js",
    src: "src/js/main.js",
    dist: "build/js",
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

const js = () =>
  src(routes.js.src)
    .pipe(
      bro({
        transform: [
          babelify.configure({ presets: ["@babel/preset-env"] }),
          ["uglifyify", { global: true }],
        ],
      })
    )
    .pipe(dest(routes.js.dist));

const watchNew = () => {
  watch(routes.pug.watch, pug);
  watch(routes.styles.watch, styles);
  watch(routes.js.watch, js);
};

// Export

const prepare = series(clean);
const assets = series(pug, styles, js);
const post = parallel(devServer, watchNew);

export const dev = series(prepare, assets, post);
