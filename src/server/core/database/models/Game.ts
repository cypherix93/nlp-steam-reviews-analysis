import {Model} from "../../base/Model";

export class Game extends Model
{
    public title:string;
    public appId:number;

    constructor(title?:string, appId?:number)
    {
        super();

        this.title = title;
        this.appId = appId;
    }
}