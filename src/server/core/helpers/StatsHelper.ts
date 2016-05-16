import _ = require("lodash");
import {DbContext} from "../database/context/DbContext";
import {Game} from "../database/models/Game";
import {AccuracyEvaluator} from "../turney/evaluators/AccuracyEvaluator";
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
        console.log(`Updating game polarity stats for ${appId}...`);

        var query = {gameId: appId, phrases: {$exists: true, $not: {$size: 0}}};
        var projection = {phrases: true};

        var testingPhrases = await DbContext.testingRecommendations.find(query, projection) as ReviewRecommendation[];

        // Get flattened array of phrases from the db result
        var phrases = _.flatten(testingPhrases.map(x => x.phrases)) as Phrase[];

        // Sort by phrase
        var sortedByPhrase = phrases.sort((x, y) =>
        {
            var nameA = x.words.map(w => w.word).join(" ").toLowerCase();
            var nameB = y.words.map(w => w.word).join(" ").toLowerCase();

            if (nameA < nameB)
                return -1;

            if (nameA > nameB)
                return 1;

            return 0;
        });

        // Get unique phrases
        var sortedUnique = _.sortedUniqBy(sortedByPhrase, x => x.words.map(x => x.word).join(" ").toLowerCase());

        // Sort by polarity
        var sortedByPolarity = sortedUnique.sort((x, y) => x.polarity - y.polarity);

        // Get top ones
        var negative = sortedByPolarity.slice(0, 10);
        var positive = sortedByPolarity.reverse().slice(0, 10);

        var update = {
            topPhrases: {positive, negative}
        };

        await DbContext.games.update({appId: appId}, {$set: update});
    }

    private static async updateGameAccuracyStats(appId:string)
    {
        console.log(`Updating accuracy stats for ${appId}...`);

        var accuracy = await AccuracyEvaluator.computeAccuracy(appId);

        var update = {
            accuracy: (accuracy * 100) | 0
        };

        await DbContext.games.update({appId: appId}, {$set: update});
    }

    private static async updateGameReviewStats(appId:string)
    {
        console.log(`Updating review percentage stats for ${appId}...`);

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
            positive: Math.round((pos / total) * 100),
            negative: Math.round((neg / total) * 100)
        };

        pos = testing.filter(x => x.recommended === true).length;
        neg = testing.filter(x => x.recommended === false).length;
        total = testing.filter(x => x.recommended !== null).length;

        percentages.test = {
            positive: Math.round((pos / total) * 100),
            negative: Math.round((neg / total) * 100)
        };

        // Update the game
        var update = {
            reviewsPercentages: percentages,
            reviewsCount: training.length
        };
        await DbContext.games.update({appId: appId}, {$set: update});
    }
}