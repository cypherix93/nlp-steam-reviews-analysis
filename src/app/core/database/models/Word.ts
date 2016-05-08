export class Word
{
    public word:string;
    public tag:string;

    constructor(word:string)
    {
        this.word = word;
    }

    public toString = function()
    {
        return this.word;
    };
    
    public toTaggedString = function ()
    {
        return this.word + "/" + this.tag;
    };
}