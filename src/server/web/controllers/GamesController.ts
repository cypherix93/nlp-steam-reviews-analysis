import {Request, Response} from "express";
import {JsonController} from "routing-controllers/decorator/Controllers";
import {Get, Post} from "routing-controllers/decorator/Methods";
import {Req, Res} from "routing-controllers/decorator/Params";

import {GameRepository} from "../repositories/GamesRepository";
import {Game} from "../../core/database/models/Game";

@JsonController("/games")
export class GameController
{
    @Get("/getForWidgets")
    public async getForWidgets():Promise<Game[]>
    {
        return await GameRepository.getGamesForWidgets();
    }

    @Get("/getById/:id")
    public async getById(@Req() request: Request):Promise<Game>
    {
        return await GameRepository.getById(request.params.id);
    }
}