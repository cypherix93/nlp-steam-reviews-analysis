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
        $stateProvider
            .state("home",
            {
                url: "/",
                templateUrl: "views/home/index.html"
            })
            .state("gameInfo",
            {
                url: "/gameInfo/:appID",
                templateUrl: "views/home/gameInfo.html",
                controller: ["$stateParams", function ($stateParams) {
                    console.log($stateParams.appID);
                }]
            });

    }]);
angular.module("AngularApp")
    .run(["$state", function($state)
    {
        $state.go("home");
    }]);
angular.module("AngularApp")
    .service("GameDataService", function GameDataService()
    {
        const self = this;

        // Node stuff
        const path = require("path");
        const fs = require("fs");

        // LowDB stuff
        const lowdb = require("lowdb");
        const storage = require("lowdb/file-sync");

        // Directories
        const dataDir = path.join(__dirname, "../../data");

        // Init db
        const dbLocation = path.join(dataDir, "db.json");
        const db = lowdb(dbLocation, {storage}, false);

        const dbReviews = db("reviews");
        const dbGames = db("games");

        // Get games
        self.getGames = function()
        {
            var games = dbGames.cloneDeep();

            for (let game of games)
            {
                game.reviewsCount = dbReviews
                    .chain()
                    .filter(r => r.gameId === game.appId)
                    .size()
                    .value();
            }

            return games;
        }
    });
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
angular.module("AngularApp").run(["$templateCache", function($templateCache) {$templateCache.put("templates/home/game-info-widget-template.html","<div class=\"panel panel-default\" ui-sref=\"gameInfo({appID: game.appId })\">\n    <div class=\"panel-body row\">\n        <div class=\"col-xs-3\">\n            <img src=\"\" alt=\"Some Image\" class=\"img-thumbnail img-responsive\">\n        </div>\n        <div class=\"col-xs-9\">\n            <h4>\n                {{game.title}}\n            </h4>\n            <uib-progress>\n                <uib-bar value=\"69\" type=\"success\">\n                    <span>Positive: 69%</span>\n                </uib-bar>\n                <uib-bar value=\"31\" type=\"danger\">\n                    <span>Negative: 31%</span>\n                </uib-bar>\n            </uib-progress>\n            <hr>\n\n            <div class=\"pull-left\">\n                App ID: {{game.appId}}\n            </div>\n            <div class=\"pull-right\">\n                {{game.reviewsCount | number:0}} reviews\n            </div>\n        </div>\n    </div>\n</div>");}]);