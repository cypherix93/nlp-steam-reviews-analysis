import {Word} from "./Word";

export class Phrase
{
    public words:Word[];

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