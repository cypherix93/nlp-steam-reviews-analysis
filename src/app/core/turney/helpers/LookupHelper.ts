import {Phrase} from "../../database/models/Phrase";
import {DbContext} from "../../database/context/DbContext";
import {Review} from "../../database/models/Review";
import _ = require("lodash");

const pos = require("pos");

export class LookupHelper
{
    private static allReviews = DbContext.reviews.filter(x => x.gameId !== "323470") as Review[];

    private static lexer = new pos.Lexer();

    public static async lookupHits(word:string):Promise<number>
    {
        var count = 0;

        for (let review of LookupHelper.allReviews)
        {
            let reviewBody = review.reviewBody;
            let words = LookupHelper.lexer.lex(reviewBody);

            count += words.filter(w => w === word).length;
        }
        return count;
    }

    public static async lookupHitsNear(phrase:Phrase, polarWord:string):Promise<number>
    {
        var count = 0;

        for (let review of LookupHelper.allReviews)
        {
            let reviewBody = review.reviewBody;
            if (reviewBody.includes(phrase.phrase) && reviewBody.includes(polarWord))
            {
                count++;
            }
        }

        return count;
    }

}