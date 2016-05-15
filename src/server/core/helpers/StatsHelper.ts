import {DbContext} from "../database/context/DbContext";
import {Review} from "../database/models/Review";
import {Game} from "../database/models/Game";
import {AccuracyEvaluator} from "../turney/evaluators/AccuracyEvaluator";

export class StatsHelper
{
    public static async updateAllGameStats()
    {
        var games = await DbContext.games.find({},{appId: true}).toArray() as Game[];
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
    }

    private static async updateGameAccuracyStats(appId:string)
    {
        var accuracy = await AccuracyEvaluator.computeAccuracy(appId);

        var update = {
            accuracy: (accuracy * 100) | 0
        };

        console.log(update);

        await DbContext.games.update({appId: appId}, {$set: update});
    }

    private static async updateGameReviewStats(appId:string)
    {
        var query = {gameId: appId} as any;
        var projection = {_id: true};

        var reviews = await DbContext.reviews.find(query, projection).toArray() as Review[];
        var reviewIds = reviews.map(x => x._id) as string[];

        query = {reviewId: {$in: reviewIds}} as any;

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
            reviewsCount: reviewIds.length
        };
        await DbContext.games.update({appId: appId}, {$set: update});
    }
}