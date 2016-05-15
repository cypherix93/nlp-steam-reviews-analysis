import {DbContext} from "../../core/database/context/DbContext";
import {GameInfoWidget} from "../viewmodels/GameInfoWidget";
import {Game} from "../../core/database/models/Game";

export class GameRepository
{
    public static async getGamesForWidgets():Promise<GameInfoWidget[]>
    {
        return await DbContext.games
            .find()
            .toArray() as GameInfoWidget[];
    }

    public static async getById(id:number):Promise<Game>
    {
        return await DbContext.games.findOne({appId: id});
    }
}