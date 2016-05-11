import {PhraseExtractor} from "../turney/phrases/PhraseExtractor";
import {PolarityCalculator} from "../turney/polarity/PolarityCalculator";
import {DbContext} from "../database/context/DbContext";
import {Review} from "../database/models/Review";
import {Phrase} from "../database/models/Phrase";

export class train
{

    private static extractor = new PhraseExtractor();
    private static polarityCalculator = new PolarityCalculator();

    public static trainGame(appId:number)
    {
        var trainingCorpus = train.getTrainCorpus(appId);
        var allPhrases:Phrase[] = [];

        for (let review of trainingCorpus)
        {
            allPhrases.push(review);
        }

        var phrasesWithPolarity = PolarityCalculator.computePolarityOfPhrases(allPhrases);

        return phrasesWithPolarity;
    }

    public static getTrainCorpus(appId:number)
    {
        var allReviews = DbContext.reviews;
        var trainingReviews = [];

        for (let review of allReviews) {
            if (review.gameId !== appId)
            {
                trainingReviews.push(review);
            }
        }
        return trainingReviews;
    }
}