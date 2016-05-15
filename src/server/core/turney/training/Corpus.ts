import {Phrase} from "../../database/models/Phrase";
import {TrainingPhrase} from "../../database/models/training/TrainingPhrase";
import {DbContext} from "../../database/context/DbContext";
import {TrainingCorpus} from "./TrainingCorpus";

export class Corpus
{
    public static async getTrainingCorpus(appId?:string):Promise<TrainingCorpus>
    {
        var results = await Promise.all([
            Corpus.getTrainingPhrases(appId),
            DbContext.trainingPhrases.count({recommended:true}),
            DbContext.trainingPhrases.count({recommended:false})
        ]);

        return new TrainingCorpus(results[0], results[1], results[2]);
    }
    
    private static async getTrainingPhrases(appId?:string):Promise<{[key:string]:Phrase}>
    {
        // Find all phrases where the gameId provided doesn't match
        var trainingPhrases = await DbContext.trainingPhrases.find({gameId: {$ne: appId}});

        return Corpus.computePhraseCounts(trainingPhrases);
    }

    // This method takes in all the phrases from a review, and updates the phrasesMap with the occurences and shit.
    private static computePhraseCounts(trainingPhrases:TrainingPhrase[]):{[key:string]:Phrase}
    {
        var phrasesMap = {} as any;

        for (let trainingPhrase of trainingPhrases)
        {
            let recommended = trainingPhrase.recommended;
            let phrase = Object.assign(new Phrase(), trainingPhrase.phrase);

            let mapKey = phrase.toString();

            let phraseInMap = phrasesMap[mapKey];

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

                // Set the counts
                phrase.positiveReviewCount = recommended ? 1 : 0;
                phrase.negativeReviewCount = recommended ? 0 : 1;

                // Store the phrase in the map
                phrasesMap[mapKey] = phrase;
            }
        }

        return phrasesMap;
    }
}