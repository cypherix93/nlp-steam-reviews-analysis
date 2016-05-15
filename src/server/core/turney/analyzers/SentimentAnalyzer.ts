import {PhraseExtractor} from "../phrases/PhraseExtractor";
import {DbContext} from "../../database/context/DbContext";
import {Review} from "../../database/models/Review";
import {PolarityCalculator} from "../polarity/PolarityCalculator";
import {Corpus} from "../training/Corpus";
import {StatsHelper} from "../../helpers/StatsHelper";
import {Game} from "../../database/models/Game";

export class SentimentAnalyzer
{
    private static extractor = new PhraseExtractor();

    public static async analyzeAllGames()
    {
        var games = await DbContext.games.find({}, {appId: true}).toArray() as Game[];
        var gameIds = games.map(x => x.appId) as string[];

        for (let gameId of gameIds)
        {
            await SentimentAnalyzer.analyzeGame(gameId);
        }
    }

    public static async analyzeGame(appId:string)
    {
        var gameReviews = await DbContext.reviews.find({gameId: appId}) as Review[];

        var trainingCorpus = await Corpus.getTrainingCorpus(appId);

        for (let review of gameReviews)
        {
            let phrases = SentimentAnalyzer.extractor.extract(review.reviewBody);

            let polarity = PolarityCalculator.computeAveragePolarityOfPhrases(phrases, trainingCorpus);

            let recommended = polarity === 0 ? null : (polarity > 0);

            // Update the testing collection in DB with the polarity values
            let reviewId = review._id;
            let query = {reviewId};
            let update = {reviewId, polarity, recommended, phrases};

            await DbContext.testingRecommendations.update(query, update, {upsert: true});
        }

        // Update the game stats for the game just tested
        await StatsHelper.updateGameStats(appId);
    }

    public static async analyzeSequence(sequence:string)
    {
        var phrases = SentimentAnalyzer.extractor.extract(sequence);

        var trainingCorpus = await Corpus.getTrainingCorpus();

        var polarity = PolarityCalculator.computeAveragePolarityOfPhrases(phrases, trainingCorpus);

        var recommended = polarity === 0 ? null : (polarity > 0);

        return {phrases, polarity, recommended};
    }
}