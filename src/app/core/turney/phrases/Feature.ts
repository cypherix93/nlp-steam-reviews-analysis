import {Phrase} from "../../database/models/Phrase";

export class Feature
{
    public firstWordTest:(tag) => boolean;
    public secondWordTest:(tag) => boolean;
    public thirdWordTest:(tag) => boolean;

    constructor(firstWordTest:(tag) => boolean, secondWordTest:(tag) => boolean, thirdWordTest:(tag) => boolean)
    {
        this.firstWordTest = firstWordTest;
        this.secondWordTest = secondWordTest;
        this.thirdWordTest = thirdWordTest;
    }

    public testPhrase(phrase:Phrase):boolean
    {
        if(phrase.words.length !== 3)
            return false;

        var firstMatch = this.firstWordTest(phrase.words[0].tag);
        var secondMatch = this.secondWordTest(phrase.words[1].tag);
        var thirdMatch = this.thirdWordTest(phrase.words[2].tag);

        return firstMatch && secondMatch && thirdMatch;
    }
}