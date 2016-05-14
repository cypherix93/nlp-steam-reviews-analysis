import {Phrase} from "../../database/models/Phrase";
import {DbContext} from "../../database/context/DbContext";

export class PolarityCalculator
{    
    public static async computeAveragePolarityOfPhrases(phrases:Phrase[], trainingCorpus:any):number
    {
        var sum = 0;
        var count = 0;

        for (let phrase of phrases)
        {
            let lookupPhrase = trainingCorpus.trainingPhrases[phrase.phrase];

            phrase.polarity = PolarityCalculator.computePolarityOfPhrase(lookupPhrase, trainingCorpus.posPhrasesCount, trainingCorpus.negPhrasesCount);
            sum += phrase.polarity;
            count++;
        }

        return (sum / count) || 0;
    }

    private static computePolarityOfPhrase(lookupPhrase:Phrase, posPhrasesCount:number, negPhrasesCount:number):number
    {
        // Laplace
        var numerator = (lookupPhrase.positiveReviewCount * negPhrasesCount) + 1;
        var denominator = (lookupPhrase.negativeReviewCount * posPhrasesCount) + 1;

        return Math.log2(numerator / denominator);
    }
}