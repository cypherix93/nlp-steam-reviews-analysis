import {DbContext} from "../../core/database/context/DbContext";
import {GameInfoWidget} from "../viewmodels/GameInfoWidget";
import {Game} from "../../core/database/models/Game";

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

            game.positiveReviewsPercentage = Math.random();
            game.negativeReviewsPercentage = 1 - game.positiveReviewsPercentage;
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
        var reviewIds = await DbContext.reviews.find({gameId: gameId}, {_id: true}) as number[];
        var recommendations;

        if (type === "testing") {
            recommendations = await DbContext.testingRecommendations.find({reviewId: {$in: reviewIds}});
        }
        else {
            recommendations = await DbContext.trainingRecommendations.find({reviewId: {$in: reviewIds}});
        }

        var positiveReviews = 0;
        var negativeReviews = 0;
        var totalReviews = recommendations.length;

        for (recommendation in recommendations)
        {
            if (recommendation.recommended)
            {
                positiveReviews++;
            }
            else {
                negativeReviews++;
            }
        }

        var positiveReviewPercentage = positiveReviews/totalReviews;
        var negativeReviewPercentage = negativeReviews/totalReviews;

        return {
            positiveReviewPercentage,
            negativeReviewPercentage
        }
    }
}