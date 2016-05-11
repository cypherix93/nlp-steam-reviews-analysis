import {PhraseExtractor} from "../turney/phrases/PhraseExtractor";
import {PolarityCalculator} from "../turney/polarity/PolarityCalculator";
import {DbContext} from "../database/context/DbContext";
import {Review} from "../database/models/Review";
import {Phrase} from "../database/models/Phrase";
import {SentimentAnalyzer} from "./SentimentAnalyzer";

export class Train {

    private static extractor = new PhraseExtractor();
    private static polarityCalculator = new PolarityCalculator();

    // This method takes in the appId of the game we're testing.
    public static trainGame(appId:number):Phrase[] {
        var trainingReviews:Review[] = Train.getTrainCorpus(appId);
        var phrases:Phrase[];

        Train.countPhrases(trainingReviews);

        // Calculate the polarity on the db set. All phrases at this point do NOT have polarity calculated.
        // They do however have counts.
        phrases = DbContext.phrases;

        //This next method needs to be updated to take in a static vocabulary size, and other things
        //Train.polarityCalculator.computePolarityOfPhrases();

        return phrases;
    }

    // This method gets the training corpus, which is all of the reviews that isn't the game we're testing.
    // 100% guaranteed that you're gonna change to filter.
    private static getTrainCorpus(appId:number):Review[] {
        var allReviews = DbContext.reviews;
        var trainingReviews = [];

        for (let review of allReviews) {
            if (review.gameId !== appId) {
                trainingReviews.push(review);
            }
        }
        return trainingReviews;
    }

    /* This method takes in all the phrases for a review, and increments its ReviewCount in the Db.
    The three cases are whether it's a positive review, negative review, or review doesn't exist.
          Might be able to make this more efficient. ^^
    */
    private static computePhraseCountByRecommended(Phrases:Phrase[], recommended:boolean) {

        for (let phrase of Phrases)
        {
            var phraseExists = DbContext.phrases
                .chain()
                .find({words: phrase.words});

            if (phraseExists && recommended)
            {
                let currentPhrase = DbContext.phrases
                    .chain()
                    .find({words: phrase.words})
                    .value();

                currentPhrase.negativeReviewCount++;

                DbContext.phrases
                    .chain()
                    .find({words: phrase.words})
                    .assign({currentPhrase});
            }
            else if (phraseExists && !recommended)
            {
                let currentPhrase = DbContext.phrases
                    .chain()
                    .find({words: phrase.words})
                    .value();

                currentPhrase.positiveReviewCount++;

                DbContext.phrases
                    .chain()
                    .find({words: phrase.words})
                    .assign({currentPhrase});
            }
            else
            {
                if (recommended)
                {
                    DbContext.phrases
                        .push({
                            words: phrase.words,
                            positiveReviewCount: 1
                        });
                }
                else
                {
                    DbContext.phrases
                        .push({
                            words: phrase.words,
                            negativeReviewCount: 1
                        });
                }
            }
        }
        return;
    }

    // This method extracts all of the phrases from each review, and updates them in the db.
    public static countPhrases(trainingReviews:Review[]) {
        for (let review of trainingReviews) {
            var recommended = review.recommended;
            var phrases:Phrase[] = Train.extractor.extract(review.reviewBody);
            Train.computePhraseCountByRecommended(phrases, recommended);
        }
    }
}