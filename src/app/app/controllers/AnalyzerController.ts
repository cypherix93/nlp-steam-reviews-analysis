import {Controller} from "../../core/base/Controller";

export class AnalyzerController extends Controller
{
    constructor()
    {
        super();

        this.initSelf(this);
    }

    public index():any
    {
        console.log("Event bootstrap worked!!");
    }
}