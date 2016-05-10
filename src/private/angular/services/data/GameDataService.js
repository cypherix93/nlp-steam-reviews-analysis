angular.module("AngularApp")
    .service("GameDataService", function GameDataService($q, IPCService)
    {
        const self = this;

        // Get games
        self.getGamesForWidgets = function()
        {
            var def = $q.defer();

            IPCService.send("game/getGamesForWidgets")
                .then(response =>
                {
                    def.resolve(response);
                });

            return def.promise;
        };

        self.getGameById = function(appId)
        {
            var def = $q.defer();

            IPCService.send("game/getById", {id: appId})
                .then(response =>
                {
                    def.resolve(response);
                });

            return def.promise;
        };
    });