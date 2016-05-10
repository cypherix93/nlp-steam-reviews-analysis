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
        var dragonBallReviews = DbContext.reviews.filter(x => x.gameId === "323470") as Review[];

        var allPhrases:Phrase[] = [];

        for (let review of dragonBallReviews)
        {
            let phrases = SentimentAnalyzer.extractor.extract(review.reviewBody);

            allPhrases = allPhrases.concat(phrases);
        }

        return PolarityCalculator.computePolarityOfPhrases(allPhrases);
    }
}