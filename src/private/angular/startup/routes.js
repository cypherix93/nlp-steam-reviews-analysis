"use strict";

angular.module("AngularApp")
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider)
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
    });