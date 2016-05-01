"use strict";

var streamqueue = require("streamqueue");

module.exports = function (gulp, plugins, paths)
{
    // Bundle AngularJS files
    gulp.task("bundle-ng-files", function ()
    {
        var angularScripts = [
            paths.angular + "angular-app.js",
            paths.angular + "startup/**/*.js",
            paths.angular + "services/**/*.js",
            paths.angular + "filters/**/*.js",
            paths.angular + "directives/**/*.js",
            paths.angular + "controllers/**/*.js"
        ];
        
        var angularTemplates = paths.angular + "templates/**/*.html";
        
        var angularDest = paths.public + "js/angular/";
        
        var scripts = gulp.src(angularScripts)
            .pipe(plugins.debug({title: "angular app:"}))
            .pipe(plugins.concat("angular-scripts.js"))
            .pipe(plugins.ngAnnotate());
        
        var templates = gulp.src(angularTemplates)
            .pipe(plugins.debug({title: "angular templates:"}))
            .pipe(plugins.htmlmin())
            .pipe(plugins.angularTemplatecache("angular-templates.js",
                {
                    module: "MainApp",
                    root: "templates/",
                    templateHeader: "<%= module %>.run([\"$templateCache\", function($templateCache) {"
                }));
        
        var bundle = new streamqueue({objectMode: true})
            .queue(scripts)
            .queue(templates)
            .done()
            .pipe(plugins.concat("angular-bundle.js"))
            .pipe(gulp.dest(angularDest))
            .pipe(plugins.uglify())
            .pipe(plugins.rename({
                suffix: ".min"
            }))
            .pipe(gulp.dest(angularDest));
        
        return bundle;
    });
};