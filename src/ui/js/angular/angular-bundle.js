"use strict";

angular.module("AngularApp", [
    "ngAnimate",
    "ngSanitize",
    "ngMessages",
    "toastr",
    "ui.bootstrap",
    "ui.router"
]);
"use strict";

angular.module("AngularApp")
    .config(["$stateProvider", "$urlRouterProvider", "$locationProvider", function ($stateProvider, $urlRouterProvider, $locationProvider)
    {
        $locationProvider.html5Mode(false);

        // Home page routes
        $stateProvider.state("home",
            {
                url: "/",
                templateUrl: "views/home/index.html"
            });
    }]);
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
angular.module("AngularApp")
    .service("GameDataService", ["AppComponentService", function GameDataService(AppComponentService)
    {
        const self = this;

        console.log(__dirname);

        // Get the db context
        const context = AppComponentService.getModule("core/database/context/DbContext").DbContext;

        // Get games
        self.getGames = function()
        {
            var games = context.games.cloneDeep();

            for (let game of games)
            {
                game.reviewsCount = context.reviews
                    .chain()
                    .filter(r => r.gameId === game.appId)
                    .size()
                    .value();
            }

            return games;
        }
    }]);
angular.module("AngularApp")
    .directive("gameInfoWidget", function()
    {
        return {
            restrict: "EA",
            scope: {
                game: "="
            },
            templateUrl: "templates/home/game-info-widget-template.html"
        }
    });
angular.module("AngularApp")
    .controller("HomeController", ["GameDataService", function HomeController(GameDataService)
    {
        const self = this;
        
        self.games = GameDataService.getGames();
    }]);
angular.module("AngularApp").run(["$templateCache", function($templateCache) {$templateCache.put("templates/home/game-info-widget-template.html","<div class=\"panel panel-default\">\r\n    <div class=\"panel-body row\">\r\n        <div class=\"col-xs-3\">\r\n            <img src=\"\" alt=\"Some Image\" class=\"img-thumbnail img-responsive\">\r\n        </div>\r\n        <div class=\"col-xs-9\">\r\n            <h4>\r\n                {{game.title}}\r\n            </h4>\r\n            <uib-progress>\r\n                <uib-bar value=\"69\" type=\"success\">\r\n                    <span>Positive: 69%</span>\r\n                </uib-bar>\r\n                <uib-bar value=\"31\" type=\"danger\">\r\n                    <span>Negative: 31%</span>\r\n                </uib-bar>\r\n            </uib-progress>\r\n            <hr>\r\n\r\n            <div class=\"pull-left\">\r\n                App ID: {{game.appId}}\r\n            </div>\r\n            <div class=\"pull-right\">\r\n                {{game.reviewsCount | number:0}} reviews\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>");}]);