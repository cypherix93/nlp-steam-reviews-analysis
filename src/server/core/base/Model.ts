import shortid = require("shortid");

export class Model
{
    public id:string;

    constructor()
    {
        this.id = shortid.generate();
    }
}