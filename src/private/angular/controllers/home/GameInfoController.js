angular.module("AngularApp")
    .controller("GameInfoController", function GameInfoController(GameDataService, $stateParams)
    {
        const self = this;

        self.games = GameDataService.getGames();

        self.game = GameDataService.getGameById($stateParams.appId);
    });