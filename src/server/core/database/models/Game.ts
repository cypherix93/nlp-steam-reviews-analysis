import {Model} from "../../base/Model";
import {Phrase} from "./Phrase";

export class Game extends Model
{
    public title:string;
    public appId:string;

    public reviewsPercentages:{
        train:{
            positive:number,
            negative:number
        },
        test:{
            positive:number,
            negative:number
        }
    };

    public reviewsCount:number;

    public accuracy:number; 

    public topPhrases:{
        positive:Phrase[],
        negative:Phrase[]
    };

    constructor(title?:string, appId?:string)
    {
        super();

        this.title = title;
        this.appId = appId;

        this.reviewsPercentages = {train: {}, test: {}} as any;
        this.topPhrases = {} as any;
    }
}