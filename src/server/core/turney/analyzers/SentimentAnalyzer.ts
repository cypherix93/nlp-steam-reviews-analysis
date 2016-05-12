import {Trainer} from "./Trainer";
import {PhraseExtractor} from "../phrases/PhraseExtractor";
import {DbContext} from "../../database/context/DbContext";
import {Review} from "../../database/models/Review";
import {Phrase} from "../../database/models/Phrase";
import {PolarityCalculator} from "../polarity/PolarityCalculator";

export class SentimentAnalyzer
{
    private static extractor = new PhraseExtractor();

    public static async analyzeGame(appId:string)
    {
        var gameReviews = await DbContext.reviews.find({gameId: appId}) as Review[];

        var trainingPhrases = await Trainer.trainForGame(appId);

        for (let review of gameReviews)
        {
            let phrases = SentimentAnalyzer.extractor.extract(review.reviewBody);

            let polarity = PolarityCalculator.computeAveragePolarityOfPhrases(phrases, trainingPhrases);

            let recommended = polarity > 0;

            // Update the testing collection in DB with the polarity values
            let query = {reviewId: review._id};
            let update = {polarity,recommended,phrases};

            await DbContext.testing.update(query, update);
        }
    }
    
    public static async analyzeSequence(sequence:string)
    {
        let phrases = SentimentAnalyzer.extractor.extract(sequence);

        var trainingPhrases = await Trainer.trainForGame();

        let polarity = PolarityCalculator.computeAveragePolarityOfPhrases(phrases, trainingPhrases);

        let recommended = polarity > 0;

        return {phrases,polarity,recommended};
    }
}