import {Phrase} from "../../database/models/Phrase";
import {TrainingPhrase} from "../../database/models/training/TrainingPhrase";
import {DbContext} from "../../database/context/DbContext";
import {Trainer} from "./Trainer";

export class Corpus
{
    private static phrasesMap:{[key:string]:Phrase};

    public static async getTrainingCorpusForGame(appId?:string):Promise<{[key:string]:Phrase}>
    {
        await Trainer.train();

        // Find all phrases where the gameId provided doesn't match
        var trainingPhrases = await DbContext.trainingPhrases.find({gameId: {$ne: appId}});
        
        return Corpus.computePhraseCounts(trainingPhrases);
    }

    // This method takes in all the phrases from a review, and updates the phrasesMap with the occurences and shit.
    private static computePhraseCounts(trainingPhrases:TrainingPhrase[]):{[key:string]:Phrase}
    {
        for (let trainingPhrase of trainingPhrases)
        {
            let recommended = trainingPhrase.recommended;
            let mapKey = trainingPhrase.phrase.toString();

            let phraseInMap = Corpus.phrasesMap[mapKey];

            if (phraseInMap)
            {
                if (recommended)
                {
                    phraseInMap.positiveReviewCount++;
                }
                else
                {
                    phraseInMap.negativeReviewCount++;
                }
            }
            else
            {
                // Get the copy of the phrase
                let phrase = Object.assign(new Phrase(), trainingPhrase.phrase);

                // Set the counts
                phrase.positiveReviewCount = recommended ? 1 : 0;
                phrase.negativeReviewCount = recommended ? 0 : 1;

                // Store the phrase in the map
                Corpus.phrasesMap[mapKey] = phrase;
            }
        }
        
        return Object.assign({}, Corpus.phrasesMap);
    }
}