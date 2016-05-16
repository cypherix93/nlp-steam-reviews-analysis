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
                });
        
        $stateProvider
            .state("test",
                {
                    url: "/test",
                    templateUrl: "views/test/index.html"
                });
        
        $stateProvider
            .state("gameInfo",
                {
                    url: "/game/:appId",
                    templateUrl: "views/gameInfo/index.html"
                });
        
        $stateProvider
            .state("reviews",
                {
                    url: "/reviews/:appId/:page",
                    templateUrl: "views/reviews/index.html"
                });
    }]);
angular.module("AngularApp")
    .run(["$state", function ($state)
    {
        $state.go("home");
    }]);
angular.module("AngularApp")
    .service("APIService", ["$http", "ConstantsService", function APIService($http, ConstantsService)
    {
        var self = this;

        var baseUrl = ConstantsService.apiBaseUrl;

        var bindMethods = function ()
        {
            for (var i = 0; i < arguments.length; i++)
            {
                var arg = arguments[i];

                self[arg] = (function(method)
                {
                    return function (apiUrl, config)
                    {
                        return $http[method](baseUrl + apiUrl, config);
                    }
                })(arg);
            }
        };

        var bindMethodsWithData = function ()
        {
            for (var i = 0; i < arguments.length; i++)
            {
                var arg = arguments[i];

                self[arg] = (function(method)
                {
                    return function (apiUrl, data, config)
                    {
                        return $http[method](baseUrl + apiUrl, data, config);
                    }
                })(arg);
            }
        };

        bindMethods("get", "delete", "head", "jsonp");
        bindMethodsWithData("post", "put", "patch");
    }]);
angular.module("AngularApp")
    .service("ConstantsService", function ConstantsService()
    {
        var self = this;

        self.apiBaseUrl = "http://localhost:31363";
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
    .directive("phrase", function ()
    {
        return {
            restrict: "A",
            scope: {
                phrase: "="
            },
            link: function (scope, element, attrs)
            {
                if(!scope.phrase.polarity)
                    scope.colorClass = "text-muted";
                else if(scope.phrase.polarity > 0)
                    scope.colorClass = "text-success";
                else
                    scope.colorClass = "text-danger";

                scope.stringValue = scope.phrase.words
                    .map(function (w)
                    {
                        return w.word;
                    })
                    .join(" ");

                scope.tooltipValue = "";

                for (var i = 0; i < scope.phrase.words.length; i++)
                {
                    var word = scope.phrase.words[i];

                    scope.tooltipValue += word.word + " (" + word.tag + ")<br>";
                }

                if (attrs.polarity)
                    scope.tooltipValue += "<br>Polarity: " + scope.phrase.polarity;
                
                scope.showTooltip = attrs.tooltip;
            },
            templateUrl: "templates/shared/phrase-template.html"
        }
    });
angular.module("AngularApp")
    .directive("posNegBar", function()
    {
        return {
            restrict: "EA",
            scope: {
                pos: "=",
                neg: "="
            },
            link: function(scope, element, attrs)
            {
                if (scope.pos === 0 && scope.neg === 0)
                {
                    scope.empty = true;
                }
            },
            templateUrl: "templates/shared/pos-neg-bar-template.html"
        }
    });
angular.module("AngularApp")
    .controller("GameInfoController", ["APIService", "$stateParams", function GameInfoController(APIService, $stateParams)
    {
        var self = this;

        APIService.get("/games/getById/" + $stateParams.appId)
            .success(function(response)
            {
                self.game = response;   
            });

        self.topReviews = ["Such a disapointmet... Flatout 1/2/UC are one of my favourite racing games, but this game is just terrible. Graphics are worse than in Flatout 2, but it lags as hell, even though my pc runs Crysis 2 on high settings without any problem. Music is worse, physics and camera are much worse, interface feels very uncomfortable. The only good thing about it is that it doesn't have GFWL support, when the UC did. Overall it is a really, really bad game. It wouldn't be such a big deal for me, if it wasn't a sequel to flatout games, but, unfortunately, it is and it makes it the worst game i have played in a last few years.",
            "Read the forum first ! If you've played the other flatout games first and think this is the same bewarned  it's not. It's a really poor attempt to cash in on the previous game's success. Also for some reason my gamepad suffers from dreadful input lag. Can i be bothered to search for a cure... no, not really. I will write the cash of as a bad investment and make a mental note to read the forum first before buying anymore of steam special offers.\nSteam you should really look at what your offering people! \nCheap does not always = bargain. :(",
            "This game does not deserve to be named FlatOut.\n\nIt was NOT made by BugBear. \nI'm not being an arrogant ♥♥♥ when I say that it looks more like it was made by your 10yo brother as his first attempt at making a game.\n\nFlatOut 2 is the one you want. FO Ultimate  Carnage is an upgraded version of FO2 with both benefits and downsides.\nI'll go and say I like FO2 better because the Bullet GT was ... well ... nerfed, I guess... Too bad, they could have buffed the other cars instead =/",
            "this  game is a complete ripoff, I want my money back, I want the time I wasted downloading back.\nI want someone at steam to feel the pain I feel for being ripped of by them It's like a kick in the nuts.\nluckily it was the summer sale and they only ripped me off for half the price of this garbage.\nI believe I may have made my last steam purchase.",
            "If you were a fan of the origional Flatout Series, this Isn't the game you're looking for. This game has an arcade type of feel versues the origional Flatout's more realistic feel, and quite frankly I hate it."];
        //self.trainingStats = GameRepository.getTrainingReviewStats;
        //self.testingStats = GameRepository.getTestingReviewStats;
        self.reviewsCount = 666;
    }]);
angular.module("AngularApp")
    .controller("HomeController", ["APIService", function HomeController(APIService)
    {
        var self = this;

        APIService.get("/games/getForWidgets")
            .success(function(response)
            {
                self.games = response;
            });
    }]);
angular.module("AngularApp")
    .controller("ReviewsController", ["$stateParams", "APIService", function ReviewsController($stateParams, APIService)
    {
        var self = this;

        var appId = $stateParams.appId;
        var page = $stateParams.page || 1;

        APIService.get("/reviews/get/" + $stateParams.appId + "/" + page)
            .success(function(response)
            {
                self.reviews = response;
            });
    }]);
angular.module("AngularApp")
    .controller("TestController", ["APIService", function (APIService)
    {
        var self = this;

        self.phrases = [];

        self.sequence = null;

        self.analyze = function ()
        {
            if (!self.sequence)
                return;

            APIService.post("analyze/sequence", {sequence: self.sequence})
                .then(function(response)
                {
                    console.log("App returned: " + response);
                });
        }
    }]);
angular.module("AngularApp").run(["$templateCache", function($templateCache) {$templateCache.put("templates/home/game-info-widget-template.html","<div class=\"panel panel-default\" ui-sref=\"gameInfo({appId: game.appId })\">\r\n    <div class=\"panel-body row\">\r\n        <div class=\"col-xs-3\">\r\n            <img ng-src=\"/images/games/{{game.appId}}.jpg\" alt=\"Some Image\" class=\"img-thumbnail img-responsive\">\r\n            <hr>\r\n            <div class=\"text-center\">\r\n                <br>\r\n                <h5 class=\"text-muted\">Accuracy</h5>\r\n                <h1>\r\n                    {{game.accuracy || \"N/A\"}}{{game.accuracy ? \"%\" : \"\"}}\r\n                </h1>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-xs-9\">\r\n            <h4>\r\n                {{game.title}}\r\n            </h4>\r\n            <hr>\r\n            <div>\r\n                <h5 class=\"text-center text-muted\" style=\"margin-bottom: -15px\">\r\n                    Train\r\n                </h5>\r\n                <pos-neg-bar pos=\"game.reviewsPercentages.train.positive\" neg=\"game.reviewsPercentages.train.negative\"></pos-neg-bar>\r\n            </div>\r\n            <hr>\r\n            <div>\r\n                <h5 class=\"text-center text-muted\" style=\"margin-bottom: -15px\">\r\n                    Test\r\n                </h5>\r\n                <pos-neg-bar pos=\"game.reviewsPercentages.test.positive\" neg=\"game.reviewsPercentages.test.negative\"></pos-neg-bar>\r\n            </div>\r\n            <hr>\r\n\r\n            <div class=\"pull-left\">\r\n                App ID: {{game.appId}}\r\n            </div>\r\n            <div class=\"pull-right\">\r\n                {{game.reviewsCount | number:0}} reviews\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>");
$templateCache.put("templates/shared/phrase-template.html","<span uib-tooltip-html=\"tooltipValue\" tooltip-enable=\"showTooltip\" class=\"{{colorClass}}\">\r\n    {{stringValue}}\r\n</span>");
$templateCache.put("templates/shared/pos-neg-bar-template.html","<div class=\"clearfix\" style=\"padding-bottom: 5px\">\r\n    <div class=\"pull-left\">\r\n        <small>\r\n            <span class=\"fa fa-thumbs-up\"></span>\r\n            Positive: {{pos || \"N/A\"}}{{neg ? \"%\" : \"\"}}\r\n        </small>\r\n    </div>\r\n    <div class=\"pull-right\">\r\n        <small>\r\n            <span class=\"fa fa-thumbs-down\"></span>\r\n            Negative: {{neg || \"N/A\"}}{{neg ? \"%\" : \"\"}}\r\n        </small>\r\n    </div>\r\n</div>\r\n<uib-progress ng-hide=\"empty\">\r\n    <uib-bar value=\"pos\" type=\"success\"></uib-bar>\r\n    <uib-bar value=\"neg\" type=\"danger\"></uib-bar>\r\n</uib-progress>\r\n<uib-progress ng-show=\"empty\">\r\n    <uib-bar value=\"50\"></uib-bar>\r\n    <uib-bar value=\"50\"></uib-bar>\r\n</uib-progress>");}]);