import {Trainer} from "../core/turney/training/Trainer";
import {SentimentAnalyzer} from "../core/turney/analyzers/SentimentAnalyzer";

export class TurneyHandler
{
    public static async train()
    {
        await Trainer.train();
    }
    public static async test(appId:string)
    {
        await SentimentAnalyzer.analyzeGame(appId);
    }
}