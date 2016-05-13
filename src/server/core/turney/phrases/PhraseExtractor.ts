import {PhraseExtractorBase} from "./PhraseExtractorBase";
import {Phrase} from "../../database/models/Phrase";
import {Word} from "../../database/models/Word";
import {POSTagger} from "../tagger/POSTagger";

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
            {
                // Drop the third word of the phrase
                phrase.words.splice(2, 1);

                // Extract the phrase
                extractedPhrases.push(phrase);
            }
        }
        
        return extractedPhrases;
    }

    private isMatchingPhrase(phrase:Phrase):boolean
    {
        // Loop over all the features testing this phrase against them
        for (let feature of this.features)
        {
            if(feature(phrase))
                return true;
        }

        // If it gets here then the phrase didn't match
        return false;
    }
}