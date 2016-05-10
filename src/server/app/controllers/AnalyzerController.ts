import {Controller} from "../../core/base/Controller";
import {SentimentAnalyzer} from "../analyzers/SentimentAnalyzer";
import q = require("q");

export class AnalyzerController extends Controller
{
    constructor()
    {
        super();

        this.initSelf(this);
    }

    public analyzeSequence(request)
    {
        var def = q.defer();

        SentimentAnalyzer.analyzeSequence(request.sequence)
            .then(result => def.resolve(result));

        console.log("Async Asserted");

        return def.promise;
    }

    public test(request)
    {
        var def = q.defer();

        setTimeout(() => def.resolve(request.sequence), 3000);

        return def.promise;
    }
}