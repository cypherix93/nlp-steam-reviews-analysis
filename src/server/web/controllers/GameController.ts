import {Request, Response} from "express";
import {JsonController} from "routing-controllers/decorator/Controllers";
import {Get, Post} from "routing-controllers/decorator/Methods";
import {Req, Res} from "routing-controllers/decorator/Params";

import {GameRepository} from "../repositories/GameRepository";
import {GameInfoWidget} from "../viewmodels/GameInfoWidget";
import {Game} from "../../core/database/models/Game";

@JsonController("/games")
export class GameController
{
    @Get("/getForWidgets")
    public getForWidgets():GameInfoWidget[]
    {
        return GameRepository.getGamesForWidgets();
    }

    @Get("/getById/:id")
    public getById(@Req() request: Request):Game
    {
        return GameRepository.getById(request.params.id);
    }
}