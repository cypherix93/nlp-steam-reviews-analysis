"use strict";

module.exports = function (gulp, plugins, paths)
{
    // Watch server files for changes
    gulp.task("watch", ["watch-app", "watch-ui"]);

    // Watch server files for changes
    gulp.task("watch-app",
        function ()
        {
            plugins.watch(paths.app + "**",
                plugins.batch(function (events, done)
                {
                    gulp.start("compile-app", done);
                }));
        });

    // Watch client files for changes
    gulp.task("watch-ui",
        function ()
        {
            plugins.watch(paths.ui + "**",
                plugins.batch(function (events, done)
                {
                    gulp.start("copy-ui-files", done);
                }));

            plugins.watch([paths.angular + "**/*.js", paths.angular + "templates/**/*.html"],
                plugins.batch(function (events, done)
                {
                    gulp.start("bundle-ng-files", done);
                }));

            plugins.watch(paths.sass + "**/*.scss",
                plugins.batch(function (events, done)
                {
                    gulp.start("preprocess-sass", done);
                }));
        });
};