import {Phrase} from "../../database/models/Phrase";

export class PhraseExtractorBase
{
    protected features:((phrase:Phrase) => boolean)[];

    constructor()
    {
        this.features = [];

        this.initWithTurneyFeatures();
    }

    public addFeature(feature:(phrase:Phrase) => boolean)
    {
        this.features.push(feature);
    }

    private initWithTurneyFeatures()
    {
        // 1. JJ | JJR | JJS
        // 2. NN | NNS
        // 3. ANY
        this.addFeature(phrase =>
        {
            let [first, second] = phrase.words.map(w => w.tag);

            let match1 = first === "JJ" || first === "JJR" || first === "JJS";
            let match2 = second === "NN" || second === "NNS";

            return match1 && match2;
        });

        // 1. RB | RBR | RBS
        // 2. JJ | JJR | JJS
        // 3. !NN & !NNS
        this.addFeature(phrase =>
        {
            let [first, second, third] = phrase.words.map(w => w.tag);

            let match1 = first === "RB" || first === "RBR" || first === "RBS";
            let match2 = second === "JJ" || second === "JJR" || second === "JJS";
            let match3 = third !== "NN" && third !== "NNS";

            return match1 && match2 && match3;
        });

        // 1. JJ | JJR | JJS
        // 2. JJ | JJR | JJS
        // 3. !NN & !NNS
        this.addFeature(phrase =>
        {
            let [first, second, third] = phrase.words.map(w => w.tag);

            let match1 = first === "JJ" || first === "JJR" || first === "JJS";
            let match2 = second === "JJ" || second === "JJR" || second === "JJS";
            let match3 = third !== "NN" && third !== "NNS";

            return match1 && match2 && match3;
        });

        // 1. NN | NNS
        // 2. JJ | JJR | JJS
        // 3. !NN & !NNS
        this.addFeature(phrase =>
        {
            let [first, second, third] = phrase.words.map(w => w.tag);

            let match1 = first === "NN" || first === "NNS";
            let match2 = second === "JJ" || second === "JJR" || second === "JJS";
            let match3 = third !== "NN" && third !== "NNS";

            return match1 && match2 && match3;
        });

        // 1. RB | RBR | RBS
        // 2. VB | VBD | VBN | VBG
        // 3. ANY
        this.addFeature(phrase =>
        {
            let [first, second] = phrase.words.map(w => w.tag);

            let match1 = first === "RB" || first === "RBR" || first === "RBS";
            let match2 = second === "VB" || second === "VBD" || second === "VBN" || second === "VBG" || second === "VBP" || second === "VBZ";

            return match1 && match2;
        });
    }
}