import {DbContext} from "../database/context/DbContext";
import {Game} from "../database/models/Game";
import {AccuracyEvaluator} from "../turney/evaluators/AccuracyEvaluator";
import _ = require("lodash");
import {Phrase} from "../database/models/Phrase";
import {ReviewRecommendation} from "../database/models/training/ReviewRecommendation";

export class StatsHelper
{
    public static async updateAllGameStats()
    {
        var games = await DbContext.games.find({}, {appId: true}).toArray() as Game[];
        var gameIds = games.map(x => x.appId) as string[];

        for (let gameId of gameIds)
        {
            await StatsHelper.updateGameStats(gameId);
        }
    }

    public static async updateGameStats(appId:string)
    {
        await StatsHelper.updateGameReviewStats(appId);
        await StatsHelper.updateGameAccuracyStats(appId);
        await StatsHelper.updateGamePolarityStats(appId);
    }

    private static async updateGamePolarityStats(appId:string)
    {
        var query = {gameId: appId, phrases: {$exists: true, $not: {$size: 0}}};
        var projection = {phrases: true};

        var testingPhrases = await DbContext.testingRecommendations.find(query, projection) as ReviewRecommendation[];

        var phrases = _.flatten(testingPhrases.map(x => x.phrases)) as Phrase[];

        var sorted = phrases.sort(x => x.polarity);

        var positive = sorted.reverse().slice(0, 5);
        var negative = sorted.slice(0, 5);

        var update = {positive, negative};

        await DbContext.games.update({gameId: appId}, {$set: update});
    }

    private static async updateGameAccuracyStats(appId:string)
    {
        var accuracy = await AccuracyEvaluator.computeAccuracy(appId);

        var update = {
            accuracy: (accuracy * 100) | 0
        };

        await DbContext.games.update({appId: appId}, {$set: update});
    }

    private static async updateGameReviewStats(appId:string)
    {
        var query = {gameId: appId};

        var [training, testing] = await Promise.all([
            DbContext.trainingRecommendations.find(query).toArray(),
            DbContext.testingRecommendations.find(query).toArray()
        ]);

        var percentages = {} as any;

        var pos, neg, total;

        pos = training.filter(x => x.recommended === true).length;
        neg = training.filter(x => x.recommended === false).length;
        total = training.filter(x => x.recommended !== null).length;

        percentages.train = {
            positive: ((pos / total) * 100) | 0,
            negative: ((neg / total) * 100) | 0
        };

        pos = testing.filter(x => x.recommended === true).length;
        neg = testing.filter(x => x.recommended === false).length;
        total = testing.filter(x => x.recommended !== null).length;

        percentages.test = {
            positive: ((pos / total) * 100) | 0,
            negative: ((neg / total) * 100) | 0
        };

        // Update the game
        var update = {
            reviewsPercentages: percentages,
            reviewsCount: training.length
        };
        await DbContext.games.update({appId: appId}, {$set: update});
    }
}