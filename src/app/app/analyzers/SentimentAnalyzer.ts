import {PhraseExtractor} from "../../core/turney/phrases/PhraseExtractor";

export class SentimentAnalyzer
{
    public static analyzeSequence(sequence:string)
    {
        var extractor = new PhraseExtractor();
        var phrases = extractor.extract(sequence);

        console.log(phrases.map(x => x.phrase));

        return phrases;
    }
}