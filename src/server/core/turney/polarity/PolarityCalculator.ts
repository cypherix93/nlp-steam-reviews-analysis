import {Phrase} from "../../database/models/Phrase";

export class PolarityCalculator
{    
    public static computeAveragePolarityOfPhrases(phrases:Phrase[], trainingPhrases:{[key:string]:Phrase}):number
    {
        var sum = 0;
        var count = 0;

        var vocabularySize = Object.keys(trainingPhrases).length;

        for (let phrase of phrases)
        {
            let lookupPhrase = trainingPhrases[phrase.phrase];

            phrase.polarity = PolarityCalculator.computePolarityOfPhrase(lookupPhrase, vocabularySize);
            sum += phrase.polarity;
            count++;
        }

        return (sum / count) || 0;
    }

    private static computePolarityOfPhrase(lookupPhrase:Phrase, vocabularySize:number):number
    {
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