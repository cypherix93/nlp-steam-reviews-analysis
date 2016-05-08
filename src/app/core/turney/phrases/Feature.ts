import {Phrase} from "../../database/models/Phrase";

export class Feature
{
    public firstExpression:string;
    public secondExpression:string;
    public thirdExpression:string;

    constructor(firstExpression:string, secondExpression:string, thirdExpression:string)
    {
        this.firstExpression = firstExpression;
        this.secondExpression = secondExpression;
        this.thirdExpression = thirdExpression;
    }

    public testPhrase(phrase:Phrase):boolean
    {
        if(phrase.words.length !== 3)
            return false;

        var firstMatch = this.testTag(phrase.words[0].tag, this.firstExpression);
        var secondMatch = this.testTag(phrase.words[1].tag, this.secondExpression);
        var thirdMatch = this.testTag(phrase.words[2].tag, this.thirdExpression);

        return firstMatch && secondMatch && thirdMatch;
    }

    private testTag(tag:string, expression:string):boolean
    {
        return eval(`${this.expressionize(tag)} === ${this.expressionize(expression)}`);
    }

    private expressionize(word:string):string
    {
        return word.replace(/([A-Z]+)/g, "'$1'");
    }
}