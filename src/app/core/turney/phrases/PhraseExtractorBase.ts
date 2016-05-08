import {Feature} from "./Feature";

export class PhraseExtractorBase
{
    protected features:Feature[];

    constructor()
    {
        this.features = [];

        this.initWithTurneyFeatures();
    }

    private initWithTurneyFeatures()
    {
        this.addFeature(
            "JJ",
            "NN || NNS",
            "ANY"
        );
        this.addFeature(
            "RB || RBR || RBS",
            "JJ",
            "!NN && !NNS"
        );
        this.addFeature(
            "JJ",
            "JJ",
            "!NN && !NNS"
        );
        this.addFeature(
            "NN || NNS",
            "JJ",
            "!NN && !NNS"
        );
        this.addFeature(
            "RB || RBR || RBS",
            "VB || VBD || VBN || VBG",
            "ANY"
        );
    }

    public addFeature(firstWord:string, secondWord:string, thirdWord:string)
    {
        this.features.push(new Feature(firstWord, secondWord, thirdWord));
    }
}