angular.module("AngularApp")
    .controller("HomeController", function HomeController(APIService)
    {
        var self = this;

        APIService.get("games/getForWidgets")
            .then(function(response)
            {
                self.games = response;
            });
    });