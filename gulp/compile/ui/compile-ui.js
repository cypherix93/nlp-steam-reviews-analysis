"use strict";

var typescript = require("typescript");
var runSequence = require("run-sequence");

module.exports = function (gulp, plugins, paths)
{    
    // Compile Client files
    gulp.task("compile-ui", ["bundle-ng-files", "preprocess-sass"], function (callback)
    {
        runSequence(
            ["bundle-ng-files", "preprocess-sass"],
            "copy-ui-files",
            callback
        );
    });

    // Compile Client files
    gulp.task("copy-ui-files", function ()
    {
        return gulp.src(paths.ui + "**")
            .pipe(plugins.debug({title: "[ui] copied:"}))
            .pipe(gulp.dest(paths.build + "ui/"));
    });
};