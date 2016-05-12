import {PhraseExtractor} from "../turney/phrases/PhraseExtractor";
import {PolarityCalculator} from "../turney/polarity/PolarityCalculator";
import {DbContext} from "../database/context/DbContext";
import {Review} from "../database/models/Review";
import {Phrase} from "../database/models/Phrase";
import {SentimentAnalyzer} from "./SentimentAnalyzer";

export class Train
{
    private static extractor = new PhraseExtractor();
    private static polarityCalculator = new PolarityCalculator();

    private static phrasesMap:{[key:string]:Phrase};

    // This method takes in the appId of the game we're testing.
    public static async trainForGame(appId:string):Phrase[]
    {
        // Reset the phrases map
        Train.phrasesMap = {};

        var trainingReviews:Review[] = Train.getTrainCorpus(appId);

        Train.countPhrases(trainingReviews);

        // Calculate the polarity on the db set. All phrases at this point do NOT have polarity calculated.
        // They do however have counts.

        //This next method needs to be updated to take in a static vocabulary size, and other things
        //phrasesTrain.polarityCalculator.computePolarityOfPhrases();

        // Return a copy of phrasesMap so we don't run into race conditions
        return Object.assign({}, Train.phrasesMap);
    }

    // This method gets the training corpus, which is all of the reviews that isn't the game we're training for.
    // This method returns an array of only the review bodies and IDs
    private static async getTrainCorpus(appId:string):Review[]
    {
        var query = {gameId: {$ne: appId}};
        var projection = {reviewBody: true};

        return await DbContext.reviews.find(query, projection);
    }

    // This method extracts all of the phrases from each review we are training on
    // And returns their counts (positive / negative)
    public static async countPhrases(trainingReviews:Review[])
    {
        for (let review of trainingReviews)
        {
            // Get the recommendation the review has
            let recommended = await DbContext.training.findOne({reviewId: review._id});

            // Extract the phrases from the review
            let phrases:Phrase[] = Train.extractor.extract(review.reviewBody);

            // Save the computed counts in the phrase map
            Train.computePhraseCountByRecommended(phrases, recommended);
        }
    }

    // This method takes in all the phrases from a review, and updates the phrasesMap with the occurences and shit.
    private static computePhraseCountByRecommended(Phrases:Phrase[], recommended:boolean)
    {
        for (let phrase of Phrases)
        {
            let phraseInMap = Train.phrasesMap[phrase.phrase];

            if(phraseInMap)
            {
                if(recommended)
                {
                    phraseInMap.positiveReviewCount++;
                }
                else
                {
                    phraseInMap.negativeReviewCount++;
                }
            }
            else
            {
                // Set the counts
                phrase.positiveReviewCount = recommended | 0;
                phrase.negativeReviewCount = recommended | 0;

                // Store the phrase in the map
                Train.phrasesMap[phrase.phrase] = phrase;
            }
        }
        return;
    }
}