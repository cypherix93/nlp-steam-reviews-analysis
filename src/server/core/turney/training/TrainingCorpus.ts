import {Phrase} from "../../database/models/Phrase";

export class TrainingCorpus
{
    public phrases:{[key:string]:Phrase};

    public positivePhrasesCount:number;
    public negativePhrasesCount:number;

    constructor(trainingPhrases:{[key:string]:Phrase}, positivePhrasesCount:number, negativePhrasesCount:number)
    {
        this.phrases = trainingPhrases;
        this.positivePhrasesCount = positivePhrasesCount;
        this.negativePhrasesCount = negativePhrasesCount;
    }
}