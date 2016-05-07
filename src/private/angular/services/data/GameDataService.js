angular.module("AngularApp")
    .service("GameDataService", function GameDataService(AppComponentService)
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
    });