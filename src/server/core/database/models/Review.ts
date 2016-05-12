import {Model} from "../../base/Model";

export class Review extends Model
{
    public reviewer:string;
    public reviewBody:string;
    public reviewerHoursPlayed:number;

    public datePosted:Date;

    public reviewVotes:{
        foundHelpful: number,
        totalVotes: number,
        foundHelpfulPercentage: number,
        foundFunny: number
    };

    public gameId:string;

    constructor(gameId:string)
    {
        super();
        
        this.gameId = gameId;
    }
}