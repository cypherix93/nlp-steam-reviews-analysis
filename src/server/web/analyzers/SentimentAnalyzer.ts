import {PhraseExtractor} from "../../core/turney/phrases/PhraseExtractor";
import {PolarityCalculator} from "../../core/turney/polarity/PolarityCalculator";
import {DbContext} from "../../core/database/context/DbContext";
import {Review} from "../../core/database/models/Review";
import {Phrase} from "../../core/database/models/Phrase";

export class SentimentAnalyzer
{
    private static extractor = new PhraseExtractor();

    public static async analyzeSequence(sequence:string):Phrase[]
    {
        var phrases = SentimentAnalyzer.extractor.extract(sequence);

        return await PolarityCalculator.computePolarityOfPhrases(phrases);
    }

    public static async analyzeGame(appId:string):Phrase[]
    {
        var gameReviews = await DbContext.reviews
            .find({gameId: appId})
            .toArray() as Review[];

        var allPhrases:Phrase[] = [];

        var predictedReviews = [];

        for (let review of gameReviews.slice(0,5))
        {
            console.log(review);

            let phrases = await SentimentAnalyzer.analyzeSequence(review.reviewBody);

            allPhrases = allPhrases.concat(phrases);
        }

        return allPhrases;
    }
}