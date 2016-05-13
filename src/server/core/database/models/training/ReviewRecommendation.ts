import {Model} from "../../../base/Model";

export class ReviewRecommendation extends Model
{
    public reviewId:string;
    public recommended:boolean;

    constructor(reviewId:string, recommended:boolean)
    {
        super();

        this.reviewId = reviewId;
        this.recommended = recommended;
    }
}