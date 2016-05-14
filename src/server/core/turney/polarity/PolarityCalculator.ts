import {Phrase} from "../../database/models/Phrase";

export class PolarityCalculator
{    
    public static computeAveragePolarityOfPhrases(phrases:Phrase[], trainingPhrases:{[key:string]:Phrase}):number
    {
        var sum = 0;
        var count = 0;

        for (let phrase of phrases)
        {
            let lookupPhrase = trainingPhrases[phrase.phrase];

            phrase.polarity = PolarityCalculator.computePolarityOfPhrase(lookupPhrase);
            sum += phrase.polarity;
            count++;
        }

        return (sum / count) || 0;
    }

    private static computePolarityOfPhrase(lookupPhrase:Phrase):number
    {
        // Laplace
        var numerator = lookupPhrase.positiveReviewCount + 1;
        var denominator = lookupPhrase.negativeReviewCount + 1;

        return Math.log2(numerator / denominator);
    }
}