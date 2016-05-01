import {Comment} from "./Comment";
import {Model} from "../../base/Model";

export class Article extends Model
{
    public title:string;
    public author:string;
    public content:string;
    
    public comments:Comment[];

    public dateCrated:Date;
    
    constructor(title?:string, author?:string, content?:string)
    {
        super();

        this.title = title;
        this.author = author;
        this.content = content;

        this.comments = [];

        this.dateCrated = new Date();
    }
}