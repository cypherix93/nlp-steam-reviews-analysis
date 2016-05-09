import {Phrase} from "../../database/models/Phrase";
import {DbContext} from "../../database/context/DbContext";
import {Review} from "../../database/models/Review";

import _ = require("lodash");

export class LookupHelper
{
    private static allReviews = DbContext.reviews.cloneDeep().filter(x => x.gameId !== "323470") as Review[];

    public static lookupOccurrences(phrase:Phrase):{positive:number, negative:number}
    {
        var result = {
            positive: 0,
            negative: 0
        };

        for (let review of LookupHelper.allReviews)
        {
            let reviewBody = review.reviewBody;

            if (reviewBody.includes(phrase.phrase))
            {
                if (review.recommended)
                    result.positive++;
                else
                    result.negative++;
            }
        }

        return result;
    }
}