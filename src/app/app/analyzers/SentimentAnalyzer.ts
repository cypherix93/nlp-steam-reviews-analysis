import {PhraseExtractor} from "../../core/turney/phrases/PhraseExtractor";
import {PolarityCalculator} from "../../core/turney/polarity/PolarityCalculator";
import {PolarWordPair} from "../../core/turney/polarity/PolarWordPair";

export class SentimentAnalyzer
{
    private static extractor = new PhraseExtractor();

    public static analyzeSequence(sequence:string)
    {
        var phrases = SentimentAnalyzer.extractor.extract(sequence);

        var polarWordPair = new PolarWordPair("good", "bad");

        phrases = PolarityCalculator.computePolarityOfPhrases(phrases, polarWordPair);

        return phrases;
    }
}