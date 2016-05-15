import {Phrase} from "../../database/models/Phrase";
import {TrainingCorpus} from "../training/TrainingCorpus";

export class PolarityCalculator
{
    public static computeAveragePolarityOfPhrases(phrases:Phrase[], trainingCorpus:TrainingCorpus):number
    {
        var sum = 0;
        var count = 0;

        for (let phrase of phrases)
        {
            let lookupPhrase = trainingCorpus.phrases[phrase.toString()];

            phrase.polarity = PolarityCalculator.computePolarityOfPhrase(lookupPhrase, trainingCorpus.positivePhrasesCount, trainingCorpus.negativePhrasesCount);
            sum += phrase.polarity;
            count++;
        }

        return (sum / count) || 0;
    }

    private static computePolarityOfPhrase(lookupPhrase:Phrase, posPhrasesCount:number, negPhrasesCount:number):number
    {
        if (!lookupPhrase)
            return 0;

        // Laplace
        var numerator = (lookupPhrase.positiveReviewCount * negPhrasesCount) + 1;
        var denominator = (lookupPhrase.negativeReviewCount * posPhrasesCount) + 1;

        return Math.log2(numerator / denominator);
    }
}