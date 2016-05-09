import {Phrase} from "../../database/models/Phrase";
import {LookupHelper} from "../helpers/LookupHelper";
import _ from "lodash";

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
        return PolarityCalculator.computeLaplaceProbability(phrase, vocabularySize, "pos") -
            PolarityCalculator.computeLaplaceProbability(phrase, vocabularySize, "neg");
    }

    private static async computeLaplaceProbability(phrase:Phrase, vocabularySize:number, type:string):Promise<number>
    {
        if (type === "pos") {
            var numerator = LookupHelper.lookupPositiveOccurrences(phrase) + 1;
        }
        else {
            var numerator = LookupHelper.lookupNegativeOccurrences(phrase) + 1;
        }
        var denominator = LookupHelper.lookupAllOccurrences(phrase) + 1 + vocabularySize;

        return numerator/denominator;
    }

}