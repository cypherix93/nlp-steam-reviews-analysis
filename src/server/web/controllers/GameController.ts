import {Request, Response} from "express";
import {JsonController} from "routing-controllers/decorator/Controllers";
import {Get, Post, Put, Patch, Delete} from "routing-controllers/decorator/Methods";
import {Req, Res} from "routing-controllers/decorator/Params";

import {GameRepository} from "../repositories/GameRepository";
import {GameInfoWidget} from "../viewmodels/GameInfoWidget";
import {Game} from "../../core/database/models/Game";

@JsonController("/games")
export class GameController
{
    @Get("/getForWidgets")
    public getGamesForWidgets():GameInfoWidget[]
    {
        return GameRepository.getGamesForWidgets();
    }

    @Get("/getById/:id")
    public getById(@Req() request: Request):Game
    {
        return GameRepository.getById(request.params.id);
    }
}