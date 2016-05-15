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

            game.reviewsPercentages = {} as any;

            game.reviewsPercentages.train = await GameRepository.getTrainingReviewStats(game.appId);
            game.reviewsPercentages.test = await GameRepository.getTestingReviewStats(game.appId);
        }

        return games;
    }

    public static async getById(id:number):Promise<Game>
    {
        return await DbContext.games.findOne({appId: id});
    }

    public static async getTrainingReviewStats(gameId:string)
    {
        return await GameRepository.getReviewStats(gameId, "training");
    }

    public static async getTestingReviewStats(gameId:string)
    {
        return await GameRepository.getReviewStats(gameId, "testing");
    }

    private static async getReviewStats(gameId:string, type:string):Promise<{positive:number, negative:number}>
    {
        var query = {gameId: gameId};
        var projection = {_id: true};

        var reviews = await DbContext.reviews.find(query, projection).toArray() as Review[];
        var reviewIds = reviews.map(x => x._id) as string[];

        var recommendations;

        if (type === "testing")
            recommendations = DbContext.testingRecommendations;
        else
            recommendations = DbContext.trainingRecommendations;

        recommendations = await recommendations.find({reviewId: {$in: reviewIds}}).toArray() as ReviewRecommendation[];

        var positiveReviews = recommendations.filter(x => x.recommended === true).length;
        var negativeReviews = recommendations.filter(x => x.recommended === false).length;
        var totalReviews = recommendations.filter(x => x.recommended !== null).length;

        console.log(positiveReviews, negativeReviews, totalReviews);

        var positive = ((positiveReviews / totalReviews) * 100) | 0;
        var negative = ((negativeReviews / totalReviews) * 100) | 0;

        return {positive, negative};
    }
}