import {DbContext} from "../../core/database/context/DbContext";
import {Game} from "../../core/database/models/Game";

export class GameRepository
{
    public static async getGamesForWidgets():Promise<Game[]>
    {
        return await DbContext.games
            .find()
            .toArray();
    }

    public static async getById(id:number):Promise<Game>
    {
        return await DbContext.games.findOne({appId: id});
    }
}