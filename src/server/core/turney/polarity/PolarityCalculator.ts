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
        }

        return distinctPhrases;
    }

    private static async computePolarity(phrase:Phrase, vocabularySize:number):Promise<number>
    {
        var occurences = LookupHelper.lookupOccurrences(phrase);

        var posOccurences = occurences.positive;
        var negOccurences = occurences.negative;
        var allOccurences = occurences.positive + occurences.negative;

        var numerator = posOccurences - negOccurences + 1;

        var denominator = allOccurences + 1 + vocabularySize;

        return numerator / denominator;
    }
}