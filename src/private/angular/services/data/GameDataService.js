angular.module("AngularApp")
    .service("GameDataService", function GameDataService(AppComponentService)
    {
        const self = this;

        // Get the db context
        const gameRepository = AppComponentService.getModule("app/repositories/GameRepository").GameRepository;

        // Get games
        self.getGames = function()
        {
            return gameRepository.getGamesForWidgets();
        }

        self.getGameById = function(appId)
        {
            return gameRepository.getById(appId);
        }
    });