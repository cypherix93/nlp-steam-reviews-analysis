export class PhraseExtractorBase
{
    private features:Feature[];

    constructor()
    {
        this.initWithTurneyFeatures();
    }

    private initWithTurneyFeatures()
    {
        this.addFeature(
            "JJ",
            "NN || NNS",
            "*"
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
            "*"
        );
    }

    public addFeature(firstWord:string, secondWord:string, thirdWord:string)
    {
        this.features.push(new Feature(firstWord, secondWord, thirdWord));
    }
}

class Feature
{
    public firstWord:string;
    public secondWord:string;
    public thirdWord:string;

    constructor(firstWord:string, secondWord:string, thirdWord:string)
    {
        this.firstWord = firstWord;
        this.secondWord = secondWord;
        this.thirdWord = thirdWord;
    }
}