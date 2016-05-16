import {DbContext} from "../../core/database/context/DbContext";
import {Review} from "../../core/database/models/Review";

export class ReviewsRepository
{
    public static async getReviewsPage(appId:string, page:number)
    {
        var query = {gameId: appId};
        var pageLength = 10;
        var skip = (page - 1) * pageLength;

        var reviews = await DbContext.reviews
            .find(query)
            .skip(skip)
            .limit(pageLength)
            .toArray() as Review[];

        return reviews;
    }
}