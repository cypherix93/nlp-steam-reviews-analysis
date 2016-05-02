"use strict";

module.exports = function (gulp, plugins, paths)
{
    // Compile SASS files
    gulp.task("preprocess-sass", function ()
    {
        var cssDir = paths.ui + "css/";

        return gulp.src(paths.sass + "main.scss")
            .pipe(plugins.debug({title: "compiling sass:"}))
            .pipe(plugins.plumber())
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.sassGlob())
            .pipe(plugins.sass())
            .pipe(gulp.dest(cssDir))

            .pipe(plugins.cleanCss())
            .pipe(plugins.rename({suffix: ".min"}))
            .pipe(plugins.sourcemaps.write("./"))
            .pipe(gulp.dest(cssDir));
    });
};