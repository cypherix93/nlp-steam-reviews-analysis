import {Phrase} from "../../database/models/Phrase";
import {PolarWordPair} from "./PolarWordPair";
import {LookupHelper} from "../helpers/LookupHelper";

export class PolarityCalculator
{
    public static computePolarityOfPhrases(phrases:Phrase[], polarWordPair:PolarWordPair):Phrase[]
    {
        var positiveHits = LookupHelper.lookupHits(polarWordPair.positive);
        var negativeHits = LookupHelper.lookupHits(polarWordPair.negative);

        for (let phrase of phrases)
        {
            PolarityCalculator.computePolarity(phrase, polarWordPair, positiveHits, negativeHits);

            console.log(`${phrase.phrase} => ${phrase.polarity}`);
        }

        return phrases;
    }

    private static computePolarity(phrase:Phrase, polarWordPair:PolarWordPair, positiveHits:number, negativeHits:number)
    {
        var positiveNearHits = LookupHelper.lookupHitsNear(phrase, polarWordPair.positive);
        var negativeNearHits = LookupHelper.lookupHitsNear(phrase, polarWordPair.negative);

        console.log(positiveNearHits, negativeNearHits, positiveHits, negativeHits);

        phrase.polarity = Math.log2(positiveNearHits * negativeHits) / (negativeNearHits * positiveHits);
    }
}