import {Model} from "../../../base/Model";

export class ReviewRecommendation extends Model
{
    public reviewId:string;
    public recommendation:boolean;

    constructor(reviewId:string, recommendation:boolean)
    {
        super();

        this.reviewId = reviewId;
        this.recommendation = recommendation;
    }
}