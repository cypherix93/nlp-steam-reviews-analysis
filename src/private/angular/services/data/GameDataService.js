angular.module("AngularApp")
    .service("GameDataService", function GameDataService()
    {
        const self = this;

        // Node stuff
        const path = require("path");
        const fs = require("fs");

        // LowDB stuff
        const lowdb = require("lowdb");
        const storage = require("lowdb/file-sync");

        // Directories
        const dataDir = path.join(__dirname, "../../data");

        // Init db
        const dbLocation = path.join(dataDir, "db.json");
        const db = lowdb(dbLocation, {storage}, false);

        const dbReviews = db("reviews");
        const dbGames = db("games");

        // Get games
        self.getGames = function()
        {
            var games = dbGames.cloneDeep();

            for (let game of games)
            {
                game.reviewsCount = dbReviews
                    .chain()
                    .filter(r => r.gameId === game.appId)
                    .size()
                    .value();
            }

            return games;
        }
    });