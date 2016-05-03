"use strict";

module.exports = function (gulp, plugins, paths)
{
    // Compile everything
    gulp.task("compile", ["compile-app", "compile-ui"]);

    // Server
    require("./compile/app/compile-app")(gulp, plugins, paths);
    
    // Client
    require("./compile/ui/compile-ui")(gulp, plugins, paths);
    require("./compile/ui/bundle-ng-files")(gulp, plugins, paths);
    require("./compile/ui/preprocess-sass")(gulp, plugins, paths);
};