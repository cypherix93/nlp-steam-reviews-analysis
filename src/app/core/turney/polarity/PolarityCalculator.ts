import {Phrase} from "../../database/models/Phrase";
import {PolarWordPair} from "./PolarWordPair";

export class PolarityCalculator
{
    public static computePolarity(phrase:Phrase, polarWordPair:PolarWordPair):number
    {
        return -1;
    }
}