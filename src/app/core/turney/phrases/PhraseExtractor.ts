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
        
        for (let i = 0; i < taggedWords.length - 2; i++)
        {            
            let phrase = new Phrase(taggedWords[i], taggedWords[i+1], taggedWords[i+2]);
            
            if(this.isMatchingPhrase(phrase))
                extractedPhrases.push(phrase);
        }
        
        return extractedPhrases;
    }

    private isMatchingPhrase(phrase:Phrase):boolean
    {
        // Loop over all the features testing this phrase against them
        for (let feature of this.features)
        {
            if(!feature.testPhrase(phrase))
                return false;
        }

        // If it gets here then the phrase matched
        return true;
    }
}