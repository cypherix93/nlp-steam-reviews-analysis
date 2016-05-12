import {Model} from "../../base/Model";

export class Game extends Model
{
    public title:string;
    public appId:string;

    constructor(title?:string, appId?:string)
    {
        super();

        this.title = title;
        this.appId = appId;
    }
}