import {Phrase} from "../../database/models/Phrase";
import {DbContext} from "../../database/context/DbContext";
import {Review} from "../../database/models/Review";
import _ = require("lodash");

const pos = require("pos");

export class LookupHelper
{
    public static lookupHits(word:string):number
    {
        var allReviews = DbContext.reviews.cloneDeep() as Review[];
        var count = 0;
        let lexer = new pos.Lexer();

        for (let review of allReviews)
        {
            let reviewBody = review.reviewBody;
            let words = lexer.lex(reviewBody);
            let wordCounts = _.countBy(words, _.identity);

            if (wordCounts[word])
            {
                count += wordCounts[word];
            }
        }
        return count;
    }

    public static lookupHitsNear(phrase:Phrase, polarWord:String):number
    {
        var allReviews = DbContext.reviews.cloneDeep() as Review[];
        var count = 0;

        for (let review of allReviews)
        {
            let reviewBody = review.reviewBody;
            if (reviewBody.includes(phrase.phrase))
            {
                if (reviewBody.includes(polarWord))
                {
                    count++;
                }
            }
        }
        return count;
    }

}