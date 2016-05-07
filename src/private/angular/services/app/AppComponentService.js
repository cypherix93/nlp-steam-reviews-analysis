angular.module("AngularApp")
    .service("AppComponentService", function()
    {
        const self = this;

        const path = require("path");
        const appDir = "../app";

        self.getModule = function(pathToModule)
        {
            return require(path.join(appDir, pathToModule));
        }
    });