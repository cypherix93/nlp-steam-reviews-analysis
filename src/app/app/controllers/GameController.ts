import {Controller} from "../../core/base/Controller";
import {GameRepository} from "../repositories/GameRepository";
import {GameInfoWidget} from "../viewmodels/GameInfoWidget";
import {Game} from "../../core/database/models/Game";

export class GameController extends Controller
{
    constructor()
    {
        super();

        this.initSelf(this);
    }

    public getGamesForWidgets():GameInfoWidget[]
    {
        return GameRepository.getGamesForWidgets();
    }

    public getById(request):Game
    {
        return GameRepository.getById(request.id);
    }
}