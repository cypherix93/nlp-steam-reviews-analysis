import {Model} from "../../../base/Model";
import {Phrase} from "../Phrase";

export class ReviewRecommendation extends Model
{
    public reviewId:string;
    public gameId:string;

    public recommended:boolean;

    public phrases:Phrase[];
    public polarity:number;

    constructor(reviewId:string, recommended:boolean)
    {
        super();

        this.reviewId = reviewId;
        this.recommended = recommended;
    }
}