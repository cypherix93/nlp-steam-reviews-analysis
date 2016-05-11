import {PhraseExtractor} from "../../core/turney/phrases/PhraseExtractor";
import {PolarityCalculator} from "../../core/turney/polarity/PolarityCalculator";
import {DbContext} from "../../core/database/context/DbContext";
import {Review} from "../../core/database/models/Review";
import {Phrase} from "../../core/database/models/Phrase";

export class SentimentAnalyzer
{
    private static extractor = new PhraseExtractor();

    public static async analyzeSequence(sequence:string)
    {
        var phrases = SentimentAnalyzer.extractor.extract(sequence);

        return await PolarityCalculator.computePolarityOfPhrases(phrases);
    }

    public static async analyzeGame(appId:string)
    {
        var gameReviews = DbContext.reviews
            .find({gameId: appId})
            .toArray()
            .slice(0, 5) as Review[];

        var allPhrases:Phrase[] = [];

        for (let review of gameReviews)
        {
            let phrases = SentimentAnalyzer.extractor.extract(review.reviewBody);

            allPhrases = allPhrases.concat(phrases);
        }

        return await PolarityCalculator.computePolarityOfPhrases(allPhrases);
    }
}