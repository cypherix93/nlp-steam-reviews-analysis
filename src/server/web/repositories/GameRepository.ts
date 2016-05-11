import {DbContext} from "../../core/database/context/DbContext";
import {GameInfoWidget} from "../viewmodels/GameInfoWidget";
import {Game} from "../../core/database/models/Game";

export class GameRepository
{
    public static async getGamesForWidgets():Promise<GameInfoWidget[]>
    {
        var games = await DbContext.games
            .find()
            .toArray() as GameInfoWidget[];

        for (let game of games)
        {
            game.reviewsCount = await DbContext.reviews
                .count({gameId: game.appId});

            game.positiveReviewsPercentage = Math.random();
            game.negativeReviewsPercentage = 1 - game.positiveReviewsPercentage;
        }

        return games;
    }

    public static async getById(id:number):Promise<Game>
    {
        return await DbContext.games.findOne({appId: id});
    }
}