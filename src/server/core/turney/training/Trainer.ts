import {PhraseExtractor} from "../phrases/PhraseExtractor";
import {Phrase} from "../../database/models/Phrase";
import {Review} from "../../database/models/Review";
import {DbContext} from "../../database/context/DbContext";
import {TrainingPhrase} from "../../database/models/training/TrainingPhrase";

export class Trainer
{
    private static extractor = new PhraseExtractor();

    private static phrasesMap:{[key:string]:Phrase};

    public static async train()
    {
        var trainingReviews:Review[] = await Trainer.getReviewsForTraining();

        await Trainer.trainPhrases(trainingReviews);
    }

    // This method gets the training corpus, which is all of the reviews that isn't the game we're training for.
    // This method returns an array of only the review bodies and IDs
    private static async getReviewsForTraining():Promise<Review[]>
    {
        var query = {};
        var projection = {reviewBody: true, gameId: true};

        return await DbContext.reviews.find(query, projection);
    }

    // This method extracts all of the phrases from each review we are training on
    private static async trainPhrases(trainingReviews:Review[])
    {
        var dbTrainingRecommendations = DbContext.trainingRecommendations;
        var dbTrainingPhrases = DbContext.trainingPhrases;

        var n = 0;

        for (let review of trainingReviews)
        {
            // Get the recommendation the review has
            let recommended = await dbTrainingRecommendations.findOne({reviewId: review._id});

            // Extract the phrases from the review
            let phrases:Phrase[] = Trainer.extractor.extract(review.reviewBody);

            for (let phrase of phrases)
            {
                let trainingPhrase = new TrainingPhrase(review.gameId, phrase, recommended);
                await dbTrainingPhrases.save(trainingPhrase);
            }

            console.log(++n);
        }
    }

    // This method takes in all the phrases from a review, and updates the phrasesMap with the occurences and shit.
    private static computePhraseCountByRecommended(Phrases:Phrase[], recommended:boolean)
    {
        for (let phrase of Phrases)
        {
            let phraseInMap = Trainer.phrasesMap[phrase.phrase];

            if (phraseInMap)
            {
                if (recommended)
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