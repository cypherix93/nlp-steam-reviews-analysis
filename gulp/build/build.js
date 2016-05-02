"use strict";

var runSequence = require("run-sequence");

module.exports = function (gulp, plugins, paths)
{
    // Build App
    gulp.task("build", function (callback)
    {
        runSequence(
            "clean",
            "compile",
            "copy-package-json",
            callback
        );
    });

    gulp.task("copy-package-json", function()
    {
        return gulp.src("./package.json")
            .pipe(gulp.dest(paths.build));
    });
};