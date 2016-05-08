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
            tag => tag === "JJ",
            tag => tag === "NN" || tag === "NNS",
            tag => true
        );
        this.addFeature(
            tag => tag === "RB" || tag === "RBR" || tag === "RBS",
            tag => tag === "JJ",
            tag => tag !== "NN" && tag !== "NNS"
        );
        this.addFeature(
            tag => tag === "JJ",
            tag => tag === "JJ",
            tag => tag !== "NN" && tag !== "NNS"
        );
        this.addFeature(
            tag => tag === "NN" || tag === "NNS",
            tag => tag === "JJ",
            tag => tag !== "NN" && tag !== "NNS"
        );
        this.addFeature(
            tag => tag === "RB" || tag === "RBR" || tag === "RBS",
            tag => tag === "VB" || tag === "VBD" || tag === "VBN" || tag === "VBG",
            tag => true
        );
    }

    public addFeature(firstWord:(tag) => boolean, secondWord:(tag) => boolean, thirdWord:(tag) => boolean)
    {
        this.features.push(new Feature(firstWord, secondWord, thirdWord));
    }
}