import {Phrase} from "../../database/models/Phrase";
import {PolarWordPair} from "./PolarWordPair";
import {LookupHelper} from "../helpers/LookupHelper";

export class PolarityCalculator
{
    public static async computePolarityOfPhrases(phrases:Phrase[], polarWordPair:PolarWordPair):Promise<Phrase[]>
    {
        var positiveHits = await LookupHelper.lookupHits(polarWordPair.positive);
        var negativeHits = await LookupHelper.lookupHits(polarWordPair.negative);

        for (let phrase of phrases)
        {
            await PolarityCalculator.computePolarity(phrase, polarWordPair, positiveHits, negativeHits);

            console.log(`${phrase.phrase} => ${phrase.polarity}`);
        }

        return phrases;
    }

    private static async computePolarity(phrase:Phrase, polarWordPair:PolarWordPair, positiveHits:number, negativeHits:number)
    {
        var positiveNearHits = await LookupHelper.lookupHitsNear(phrase, polarWordPair.positive);
        var negativeNearHits = await LookupHelper.lookupHitsNear(phrase, polarWordPair.negative);

        console.log(positiveNearHits, negativeNearHits, positiveHits, negativeHits);

        phrase.polarity = Math.log2(positiveNearHits * negativeHits) / (negativeNearHits * positiveHits);
    }
}