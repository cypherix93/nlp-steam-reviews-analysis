"use strict";

var typescript = require("typescript");

module.exports = function (gulp, plugins, paths)
{
    // Compile Server files
    gulp.task("compile-app", function ()
    {
        var tsFilter = plugins.filter("**/*.ts", {restore: true});

        return gulp.src(paths.app + "**")
            .pipe(tsFilter)
            .pipe(plugins.typescript({
                typescript: typescript,
                target: "ES6",
                module: "commonjs",
                experimentalDecorators: true,
                removeComments: true
            }))
            .pipe(plugins.debug({title: "[app] compiled:"}))
            .pipe(tsFilter.restore)
            .pipe(gulp.dest(paths.build + "app/"));
    });
};