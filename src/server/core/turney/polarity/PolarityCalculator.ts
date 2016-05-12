import {Phrase} from "../../database/models/Phrase";

export class PolarityCalculator
{    
    public static computeAveragePolarityOfPhrases(phrases:Phrase[], trainingPhrases:{[key:string]:Phrase}):number
    {
        var sum = 0;
        var count = 0;

        for (let phrase of phrases)
        {
            phrase.polarity = PolarityCalculator.computePolarityOfPhrase(phrase, trainingPhrases);
            sum += phrase.polarity;
            count++;
        }

        return sum / count;
    }

    private static computePolarityOfPhrase(testPhrase:Phrase, trainingPhrases:{[key:string]:Phrase}):number
    {
        var phraseKeys = Object.keys(trainingPhrases);
        var vocabularySize = phraseKeys.length;

        var lookupPhrase = trainingPhrases[testPhrase.phrase];

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