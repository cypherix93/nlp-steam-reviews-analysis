angular.module("AngularApp")
    .controller("GameInfoController", function GameInfoController(GameDataService, $stateParams)
    {
        const self = this;

        self.games = GameDataService.getGames();

        self.appID = $stateParams.appID;
        console.log("App id: " + self.appID);
    });