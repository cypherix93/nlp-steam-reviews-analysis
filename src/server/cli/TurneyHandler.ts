import {Trainer} from "../core/turney/training/Trainer";
import {SentimentAnalyzer} from "../core/turney/analyzers/SentimentAnalyzer";
import {AccuracyEvaluator} from "../core/turney/evaluators/AccuracyEvaluator";
import {StatsHelper} from "../core/helpers/StatsHelper";

export class TurneyHandler
{
    public static async train()
    {
        await Trainer.train();

        console.log("Training completed.");
    }

    public static async test(appId?:string)
    {
        if(!appId)
        {
            await SentimentAnalyzer.analyzeAllGames();
            return; 
        }

        await SentimentAnalyzer.analyzeGame(appId);
        console.log("Completed testing game successfully.");
    }
    
    public static async updateGame(appId?:string)
    {
        if(!appId)
            await StatsHelper.updateAllGameStats();
        else
            await StatsHelper.updateGameStats(appId);
    }

    public static async computeAccuracy(appId?:string)
    {
        var result = await AccuracyEvaluator.computeAccuracy(appId);

        console.log(`Accuracy on ${appId ? "game (" + appId + ")" : "all games"}: ${result}`);
    }
}