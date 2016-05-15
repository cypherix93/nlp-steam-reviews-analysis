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

    private static async getReviewStats(gameId:string, type:string)
    {
        var reviews = await DbContext.reviews.find({gameId: gameId}, {_id: true}).toArray() as Review[];
        var reviewIds = reviews.map(r => r._id);
        var recommendations;
        
        if (type === "testing") {
            recommendations = DbContext.testingRecommendations.find({reviewId: {$in: reviewIds}});
        }
        else {
            recommendations = DbContext.trainingRecommendations.find({reviewId: {$in: reviewIds}});
        }

        var positiveReviews = await recommendations.count({ recommended: true });
        var negativeReviews = await recommendations.count({ recommended: false });
        var totalReviews = recommendations.count();

        var positive = positiveReviews/totalReviews;
        var negative = negativeReviews/totalReviews;

        return {positive, negative};
    }
}