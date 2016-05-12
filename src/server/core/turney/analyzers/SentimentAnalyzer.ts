import {PhraseExtractor} from "../phrases/PhraseExtractor";
import {DbContext} from "../../database/context/DbContext";
import {Review} from "../../database/models/Review";
import {PolarityCalculator} from "../polarity/PolarityCalculator";
import {Trainer} from "../training/Trainer";
import {Corpus} from "../training/Corpus";

export class SentimentAnalyzer
{
    private static extractor = new PhraseExtractor();

    public static async analyzeGame(appId:string)
    {
        var gameReviews = await DbContext.reviews.find({gameId: appId}) as Review[];

        var trainingPhrases = await Corpus.getTrainingCorpusForGame(appId);

        var n = 0;

        for (let review of gameReviews)
        {
            let phrases = SentimentAnalyzer.extractor.extract(review.reviewBody);

            let polarity = PolarityCalculator.computeAveragePolarityOfPhrases(phrases, trainingPhrases);

            let recommended = polarity === 0 ? null : (polarity > 0);

            // Update the testing collection in DB with the polarity values
            let reviewId = review._id;
            let query = {reviewId};
            let update = {reviewId,polarity,recommended,phrases};

            await DbContext.testingRecommendations.update(query, update, {upsert:true});

            console.log("Analyzing: " + ++n);
            console.log(polarity,recommended);
        }
    }
    
    public static async analyzeSequence(sequence:string)
    {
        let phrases = SentimentAnalyzer.extractor.extract(sequence);

        var trainingPhrases = await Corpus.getTrainingCorpusForGame();

        let polarity = PolarityCalculator.computeAveragePolarityOfPhrases(phrases, trainingPhrases);

        let recommended = polarity === 0 ? null : (polarity > 0);

        return {phrases,polarity,recommended};
    }
}