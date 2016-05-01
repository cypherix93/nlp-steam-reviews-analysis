"use strict";

module.exports = function (gulp, plugins, paths)
{
    // Watch server files for changes
    gulp.task("watch", ["watch-server", "watch-client"]);

    // Watch server files for changes
    gulp.task("watch-server",
        function ()
        {
            plugins.watch(paths.server + "**",
                plugins.batch(function (events, done)
                {
                    gulp.start("compile-server", done);
                }));
        });

    // Watch client files for changes
    gulp.task("watch-client",
        function ()
        {
            plugins.watch([paths.angular + "**/*.js", paths.angular + "templates/**/*.html"],
                plugins.batch(function (events, done)
                {
                    gulp.start("bundle-ng-files", done);
                }));
            
            plugins.watch(paths.sass + "**/*.scss",
                plugins.batch(function (events, done)
                {
                    gulp.start("compile-sass", done);
                }));
        });
};