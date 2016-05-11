import {PhraseExtractor} from "../turney/phrases/PhraseExtractor";
import {PolarityCalculator} from "../turney/polarity/PolarityCalculator";
import {DbContext} from "../database/context/DbContext";
import {Review} from "../database/models/Review";
import {Phrase} from "../database/models/Phrase";
import {SentimentAnalyzer} from "./SentimentAnalyzer";

export class Train {

    private static extractor = new PhraseExtractor();
    private static polarityCalculator = new PolarityCalculator();


    private trainGame(appId:number) {
        var trainingReviews:Review[] = Train.getTrainCorpus(appId);
        var phrasesWithPolarity:Phrase[];

        for (let review of trainingReviews) {
            var recommended = review.recommended;
            var phrases:Phrase[] = Train.extractor.extract(review.reviewBody);
            Train.computePhraseCountByRecommended(phrases, recommended);
        }

        

        return phrasesWithPolarity;
    }

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
}