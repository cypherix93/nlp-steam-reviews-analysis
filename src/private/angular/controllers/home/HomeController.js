angular.module("AngularApp")
    .controller("HomeController", function HomeController(APIService)
    {
        var self = this;

        APIService.get("/games/getForWidgets")
            .success(function(response)
            {
                self.games = response;
            });
    });