export class GameInfoWidget
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

    constructor()
    {
        this.reviewsPercentages = {
            train:{},
            test:{}
        } as any ;
    }
}