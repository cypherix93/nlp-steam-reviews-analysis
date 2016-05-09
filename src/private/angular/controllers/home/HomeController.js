angular.module("AngularApp")
    .controller("HomeController", function HomeController(GameDataService)
    {
        const self = this;
        
        self.games = GameDataService.getGamesForWidgets();
    });