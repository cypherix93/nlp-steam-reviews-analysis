import {PhraseExtractor} from "../phrases/PhraseExtractor";
import {Phrase} from "../../database/models/Phrase";
import {Review} from "../../database/models/Review";
import {DbContext} from "../../database/context/DbContext";

export class Trainer
{
    private static extractor = new PhraseExtractor();

    private static phrasesMap:{[key:string]:Phrase};

    // This method takes in the appId of the game we're testing and then trains over all the other games.
    // If appId is not provided, it trains with all the games
    public static async trainForGame(appId?:string):Promise<{[key:string]:Phrase}>
    {
        // Reset the phrases map
        Trainer.phrasesMap = {};

        var trainingReviews:Review[] = await Trainer.getTrainCorpus(appId);

        await Trainer.extractPhrasesAndComputeCounts(trainingReviews);

        // Return a copy of phrasesMap so we don't run into race conditions
        return Object.assign({}, Trainer.phrasesMap);
    }

    // This method gets the training corpus, which is all of the reviews that isn't the game we're training for.
    // This method returns an array of only the review bodies and IDs
    private static async getTrainCorpus(appId:string):Promise<Review[]>
    {
        var query = {gameId: {$ne: appId}};
        var projection = {reviewBody: true};

        return await DbContext.reviews.find(query, projection);
    }

    // This method extracts all of the phrases from each review we are training on
    private static async extractPhrasesAndComputeCounts(trainingReviews:Review[])
    {
        var dbTraining = DbContext.training;

        for (let review of trainingReviews)
        {
            // Get the recommendation the review has
            let recommended = await dbTraining.findOne({reviewId: review._id});

            // Extract the phrases from the review
            let phrases:Phrase[] = Trainer.extractor.extract(review.reviewBody);

            // Save the computed counts in the phrase map
            Trainer.computePhraseCountByRecommended(phrases, recommended);
        }
    }

    // This method takes in all the phrases from a review, and updates the phrasesMap with the occurences and shit.
    private static computePhraseCountByRecommended(Phrases:Phrase[], recommended:boolean)
    {
        for (let phrase of Phrases)
        {
            let phraseInMap = Trainer.phrasesMap[phrase.phrase];

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
                phrase.positiveReviewCount = recommended ? 1 : 0;
                phrase.negativeReviewCount = recommended ? 0 : 1;

                // Store the phrase in the map
                Trainer.phrasesMap[phrase.phrase] = phrase;
            }
        }
    }
}