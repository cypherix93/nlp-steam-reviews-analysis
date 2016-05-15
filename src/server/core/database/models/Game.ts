import {Model} from "../../base/Model";

export class Game extends Model
{
    public title:string;
    public appId:string;

    public reviewsPercentages:{
        train: {
            positive:number,
            negative:number
        },
        test: {
            positive:number,
            negative:number
        }
    };

    public reviewsCount:number;

    public accuracy:number;

    constructor(title?:string, appId?:string)
    {
        super();

        this.title = title;
        this.appId = appId;
    }
}