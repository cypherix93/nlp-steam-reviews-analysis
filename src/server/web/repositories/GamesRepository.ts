import {DbContext} from "../../core/database/context/DbContext";
import {GameInfoWidget} from "../viewmodels/GameInfoWidget";
import {Game} from "../../core/database/models/Game";
import {ReviewRecommendation} from "../../core/database/models/training/ReviewRecommendation";
import {Review} from "../../core/database/models/Review";

export class GameRepository
{
    public static async getGamesForWidgets():Promise<GameInfoWidget[]>
    {
        var games = await DbContext.games
            .find()
            .toArray() as GameInfoWidget[];

        for (let game of games)
        {
            game.reviewsCount = await DbContext.reviews
                .count({gameId: game.appId});

            game.reviewsPercentages = await GameRepository.getReviewStats(game.appId);
        }

        return games;
    }

    public static async getById(id:number):Promise<Game>
    {
        return await DbContext.games.findOne({appId: id});
    }

    private static async getReviewStats(gameId:string):Promise<any>
    {
        var query = {gameId: gameId};
        var projection = {_id: true};

        var reviews = await DbContext.reviews.find(query, projection).toArray() as Review[];
        var reviewIds = reviews.map(x => x._id) as string[];

        var query = {reviewId: {$in: reviewIds}};

        var [training, testing] = await Promise.all([
            DbContext.trainingRecommendations.find(query).toArray(),
            DbContext.testingRecommendations.find(query).toArray()
        ]);

        var result = {} as any;

        var pos, neg, total;

        pos = training.filter(x => x.recommended === true).length;
        neg = training.filter(x => x.recommended === false).length;
        total = training.filter(x => x.recommended !== null).length;

        result.train = {
            positive: ((pos / total) * 100) | 0,
            negative: ((neg / total) * 100) | 0
        };

        pos = testing.filter(x => x.recommended === true).length;
        neg = testing.filter(x => x.recommended === false).length;
        total = testing.filter(x => x.recommended !== null).length;

        result.test = {
            positive: ((pos / total) * 100) | 0,
            negative: ((neg / total) * 100) | 0
        };

        return result;
    }
}