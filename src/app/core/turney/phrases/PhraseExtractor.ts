import {PhraseExtractorBase} from "./PhraseExtractorBase";
import {Phrase} from "../../database/models/Phrase";
import {POSTagger} from "../../tagger/POSTagger";
import {Word} from "../../database/models/Word";

export class PhraseExtractor extends PhraseExtractorBase
{
    constructor()
    {
        super();
    }
    
    public extract(sequence:string):Phrase[]
    {
        var taggedWords = POSTagger.tagSequence(sequence);
        return this.extractPhrasesWithFeatures(taggedWords);
    }
    
    private extractPhrasesWithFeatures(taggedWords:Word[]):Phrase[]
    {
        var extractedPhrases:Phrase[] = [];
        
        for (let i = 0; i < taggedWords.length; i++)
        {            
            let phrase = new Phrase(taggedWords[i], taggedWords[i+1], taggedWords[i+2]);
            
            if(this.isMatchingPhrase(phrase))
                extractedPhrases.push(phrase);
        }
        
        return extractedPhrases;
    }

    private isMatchingPhrase(phrase:Phrase):boolean
    {
        // Implement the matching phrase by looking at each feature in this extractor

        return false;
    }
}