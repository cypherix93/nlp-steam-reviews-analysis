import {Trainer} from "./Trainer";
import {PhraseExtractor} from "../phrases/PhraseExtractor";
import {DbContext} from "../../database/context/DbContext";
import {Review} from "../../database/models/Review";
import {Phrase} from "../../database/models/Phrase";

export class SentimentAnalyzer
{
    private static extractor = new PhraseExtractor();

    public static async analyzeGame(appId:string)
    {
        var gameReviews = DbContext.reviews.find({gameId: appId}) as Review[];

        var trainingPhrases = Trainer.trainForGame(appId);

        var dbTesting = DbContext.testing;

        for (let review of gameReviews)
        {
            let polarity = SentimentAnalyzer.computePolarityOfReview(review.reviewBody, trainingPhrases);
            let recommended = polarity > 0;

            // Update the testing collection in DB with the polarity values
            let query = {reviewId: review._id};
            let update = {polarity,recommended};
            dbTesting.update(query, update);
        }
    }
    
    private static computePolarityOfReview(reviewBody:string, trainingPhrases:{[key:string]:Phrase}):number
    {
        var phrases = SentimentAnalyzer.extractor.extract(reviewBody);
        
        return SentimentAnalyzer.computeAveragePolarityOfPhrases(phrases, trainingPhrases);
    }
    
    private static computeAveragePolarityOfPhrases(phrases:Phrase[], trainingPhrases:{[key:string]:Phrase}):number
    {
        var sum = 0;
        var count = 0;
        
        for (let phrase of phrases)
        {
            sum += SentimentAnalyzer.computePolarityOfPhrase(phrase, trainingPhrases);
            count++;
        }
        
        return sum / count;
    }
    
    private static computePolarityOfPhrase(testPhrase:Phrase, trainingPhrases:{[key:string]:Phrase}):number
    {
        var phraseKeys = Object.keys(trainingPhrases);
        var vocabularySize = phraseKeys.length;

        var lookupPhrase = trainingPhrases[testPhrase.phrase];

        var posOccurences, negOccurences, allOccurences;

        // If phrase exists, compute polarity based on occurence counts
        if(lookupPhrase)
        {
            posOccurences = lookupPhrase.positiveReviewCount;
            negOccurences = lookupPhrase.negativeReviewCount;
            allOccurences = posOccurences + negOccurences;
        }
        // Otherwise return smoothed probability
        else
        {
            posOccurences = negOccurences = allOccurences = 0;
        }

        // Laplace
        var numerator = posOccurences - negOccurences + 1;
        var denominator = allOccurences + 1 + vocabularySize;

        return numerator / denominator;
    }
}