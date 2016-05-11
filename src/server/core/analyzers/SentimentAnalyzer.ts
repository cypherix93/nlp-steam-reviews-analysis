import {PhraseExtractor} from "../turney/phrases/PhraseExtractor";
import {PolarityCalculator} from "../turney/polarity/PolarityCalculator";
import {DbContext} from "../database/context/DbContext";
import {Review} from "../database/models/Review";
import {Phrase} from "../database/models/Phrase";

export class SentimentAnalyzer
{
    private static extractor = new PhraseExtractor();

    public static async analyzeGame(appId:string)
    {
        var gameReviews = DbContext.reviews.filter(x => x.gameId === appId) as Review[];

        var allPhrases:Phrase[] = [];

        for (let review of gameReviews)
        {
            let phrases = SentimentAnalyzer.extractor.extract(review.reviewBody);
            allPhrases = allPhrases.concat(phrases);
        }



        return await PolarityCalculator.computePolarityOfPhrases(allPhrases);
    }
}