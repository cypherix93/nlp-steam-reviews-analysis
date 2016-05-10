import {Word} from "./Word";

export class Phrase
{
    public words:Word[];

    public polarity:number;

    constructor(...words:Word[])
    {
        this.words = words;
    }

    public get phrase():string
    {
        return this.words
            .map(w => w.word)
            .join(" ");
    }
}