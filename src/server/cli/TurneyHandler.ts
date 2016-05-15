import {Trainer} from "../core/turney/training/Trainer";
import {SentimentAnalyzer} from "../core/turney/analyzers/SentimentAnalyzer";
import {AccuracyEvaluator} from "../core/turney/evaluators/AccuracyEvaluator";
import {StatsHelper} from "../core/helpers/StatsHelper";

export class TurneyHandler
{
    public static async train()
    {
        await Trainer.train();

        console.log("\nTraining completed.");
    }

    public static async test(appId?:string)
    {
        if(!appId)
            await SentimentAnalyzer.analyzeAllGames();
        else
            await SentimentAnalyzer.analyzeGame(appId);

        console.log("\nCompleted testing game(s) successfully.");
    }
    
    public static async updateGame(appId?:string)
    {
        if(!appId)
            await StatsHelper.updateAllGameStats();
        else
            await StatsHelper.updateGameStats(appId);

        console.log("\nCompleted updating game(s) successfully.");
    }

    public static async computeAccuracy(appId?:string)
    {
        var result = await AccuracyEvaluator.computeAccuracy(appId);

        console.log(`\nAccuracy on ${appId ? "game (" + appId + ")" : "all games"}: ${result}`);
    }
}