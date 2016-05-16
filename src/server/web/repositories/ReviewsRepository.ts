import {DbContext} from "../../core/database/context/DbContext";
import {Review} from "../../core/database/models/Review";

export class ReviewsRepository
{
    public static async getReviewsPage(appId:string, page:number)
    {
        var query = {gameId: appId};
        var pageLength = 10;
        var skip = (page - 1) * pageLength;

        var reviewsQuery = DbContext.reviews.find(query);

        var reviewsCount = await reviewsQuery.count();

        var reviews = await reviewsQuery
            .skip(skip)
            .limit(pageLength)
            .toArray() as Review[];

        return {reviews, reviewsCount};
    }
}