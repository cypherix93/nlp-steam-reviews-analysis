import {DbContext} from "../../core/database/context/DbContext";
import {GameInfoWidget} from "../viewmodels/GameInfoWidget";

export class GameRepository
{
    public static getGamesForWidgets():GameInfoWidget[]
    {
        var games = DbContext.games.cloneDeep() as GameInfoWidget[];

        for (let game of games)
        {
            game.reviewsCount = DbContext.reviews
                .chain()
                .filter(r => r.gameId === game.appId)
                .size()
                .value();
        }

        return games;
    }

    public static getById(id:number)
    {
        return DbContext.games
            .chain()
            .filter(g => g.appId === id)
            .value()[0];
    }
}