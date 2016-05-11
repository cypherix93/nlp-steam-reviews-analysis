import {Phrase} from "../../database/models/Phrase";
import {DbContext} from "../../database/context/DbContext";
import {Review} from "../../database/models/Review";

import _ = require("lodash");

export class LookupHelper
{
    public static async lookupOccurrences(phrase:Phrase):Promise<{positive:number, negative:number}>
    {
        var allReviews = await DbContext.reviews.find().toArray() as Review[];
        
        var result = {
            positive: 0,
            negative: 0
        };

        for (let review of allReviews)
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