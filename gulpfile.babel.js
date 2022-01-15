import del from "del";
import { dest, parallel, series, src, watch } from "gulp";
import GulpPug from "gulp-pug";
import webserver from "gulp-webserver";

const routes = {
  pug: {
    watch: "src/**/*.pug",
    src: "src/*.pug",
    dest: "build",
  },
};

// Tasks

const pug = () =>
  src(routes.pug.src).pipe(GulpPug()).pipe(dest(routes.pug.dest));

const clean = () => del(["build"]);

const devServer = () =>
  src("build").pipe(webserver({ livereload: true, open: true }));

const watchPug = () => {
  watch(routes.pug.watch, pug);
};

// Export

const prepare = series(clean);
const assets = series(pug);
const postDev = parallel(devServer, watchPug);

export const dev = series(prepare, assets, postDev);
