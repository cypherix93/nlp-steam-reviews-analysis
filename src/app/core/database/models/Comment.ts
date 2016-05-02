import {Model} from "../../base/Model";

export class Comment extends Model
{
    public author:string;
    public content:string;
    
    public children:Comment[];

    public dateCrated:Date;

    constructor(author?:string, content?:string)
    {
        super();
        
        this.author = author;
        this.content = content;

        this.children = [];

        this.dateCrated = new Date();
    }
}