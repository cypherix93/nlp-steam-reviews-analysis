import {PhraseExtractor} from "../../core/turney/phrases/PhraseExtractor";

export class SentimentAnalyzer
{
    private static extractor = new PhraseExtractor();

    public static analyzeSequence(sequence:string)
    {
        var phrases = SentimentAnalyzer.extractor.extract(sequence);

        console.log(phrases.map(x => x.phrase));

        return phrases;
    }
}