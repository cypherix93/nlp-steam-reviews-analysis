import {Word} from "../database/models/Word";
const pos = require("pos");

export class POSTagger
{
    public static tagSequence(sequence:string):Word[]
    {
        var lexer = new pos.Lexer();
        var tagger = new pos.Tagger();

        var words = lexer.lex(sequence);
        var taggedWords = tagger.tag(words);

        var result:Word[] = [];

        for (let key in taggedWords)
        {
            if (!taggedWords.hasOwnProperty(key))
                continue;

            var taggedWord = taggedWords[key];

            var word = new Word(taggedWord[0]);
            word.tag = taggedWord[1];

            result.push(word);
        }

        return result;
    }
}