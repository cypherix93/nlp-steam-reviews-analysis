import {Phrase} from "../../database/models/Phrase";
import {LookupHelper} from "../helpers/LookupHelper";
import _ = require("lodash");

export class PolarityCalculator
{
    public static async computePolarityOfPhrases(phrases:Phrase[]):Promise<Phrase[]>
    {
        var distinctPhrases = _.uniqBy(phrases, "phrase");

        var vocabularySize = distinctPhrases.length;

        for (let phrase of distinctPhrases)
        {
            phrase.polarity = await PolarityCalculator.computePolarity(phrase, vocabularySize);
            console.log(`${phrase.phrase} => ${phrase.polarity}`);
        }

        return distinctPhrases;
    }

    private static async computePolarity(phrase:Phrase, vocabularySize:number):Promise<number>
    {
        var posOccurences = LookupHelper.lookupPositiveOccurrences(phrase);
        var negOccurences = LookupHelper.lookupNegativeOccurrences(phrase);
        var allOccurences = LookupHelper.lookupAllOccurrences(phrase);

        var numerator = posOccurences - negOccurences + 1;

        var denominator = allOccurences + 1 + vocabularySize;

        return numerator / denominator;
    }
}