"use strict";

var typescript = require("typescript");

module.exports = function (gulp, plugins, paths)
{    
    // Compile Client files
    gulp.task("compile-client", ["bundle-ng-files", "preprocess-sass"], function ()
    {
        return gulp.src(paths.public + "**")
            .pipe(plugins.debug({title: "[web] copied:"}))
            .pipe(gulp.dest(paths.build + "public/"));
    });
};