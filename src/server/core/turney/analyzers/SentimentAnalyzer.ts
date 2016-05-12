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
        var gameReviews = await DbContext.reviews.find({gameId: appId}) as Review[];

        var trainingPhrases = Trainer.trainForGame(appId);

        for (let review of gameReviews)
        {
            SentimentAnalyzer.computePolarityOfReview(review, trainingPhrases);
        }
    }
    
    private static async computePolarityOfReview(review:Review, trainingPhrases:{[key:string]:Phrase})
    {
        var phrases = SentimentAnalyzer.extractor.extract(review.reviewBody);
        
        var polarity = SentimentAnalyzer.computeAveragePolarityOfPhrases(phrases, trainingPhrases);

        var recommended = polarity > 0;

        // Update the testing collection in DB with the polarity values
        var query = {reviewId: review._id};
        var update = {polarity,recommended,phrases};

        await DbContext.testing.update(query, update);
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