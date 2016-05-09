import {Phrase} from "../../database/models/Phrase";
import {DbContext} from "../../database/context/DbContext";
import {Review} from "../../database/models/Review";
import _ = require("lodash");

const pos = require("pos");

export class LookupHelper
{
    private static allReviews = DbContext.reviews.filter(x => x.gameId !== "323470") as Review[];

    public static lookupAllOccurrences(phrase: Phrase):number
    {
        return LookupHelper.countOccurrences(phrase);
    }

    public static lookupNegativeOccurrences(phrase: Phrase):number
    {
        return LookupHelper.countOccurrences(phrase, "neg");
    }

    public static lookupPositiveOccurrences(phrase: Phrase):number
    {
        return LookupHelper.countOccurrences(phrase, "pos");
    }

    private static countOccurrences(phrase:Phrase, type?:string):number
    {
        var count = 0;

        if (type === "pos")
        {
            for (let review of LookupHelper.allReviews)
            {
                let reviewBody = review.reviewBody;
                if (reviewBody.includes(phrase.phrase) && (review.recommended))
                {
                    count++;
                }
            }
        }
        else if (type === "neg")
        {
            for (let review of LookupHelper.allReviews)
            {
                let reviewBody = review.reviewBody;
                if (reviewBody.includes(phrase.phrase) && (!review.recommended))
                {
                    count++;
                }
            }
        }
        else
        {
            for (let review of LookupHelper.allReviews)
            {
                let reviewBody = review.reviewBody;
                if (reviewBody.includes(phrase.phrase))
                {
                    count++;
                }
            }

        }
        return count;
    }
}