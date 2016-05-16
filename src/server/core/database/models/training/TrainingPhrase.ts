import {Model} from "../../../base/Model";
import {Phrase} from "../Phrase";

export class TrainingPhrase extends Model
{
    public gameId:string;
    public phrase:Phrase;
    public recommended:boolean;

    constructor(gameId:string, phrase:Phrase, recommended:boolean)
    {
        super();
        
        this.gameId = gameId;
        this.phrase = phrase;
        this.recommended = recommended;
    }
}