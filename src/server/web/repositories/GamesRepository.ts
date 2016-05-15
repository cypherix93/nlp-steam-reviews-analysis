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

    public static getTrainingReviewStats(id:number)
    {
        var game = DbContext.trainingRecommendations.findOne({appId: id});
        var positiveReviews = 0;
        var negativeReviews = 0;
        var totalReviews = game.reviews.length;

        for (review in game.reviews)
        {
            if (review.recommended)
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

    public static getTestingReviewStats(id:number)
    {
        var game = DbContext.testingRecommendations.findOne({appId: id});
        var positiveReviews = 0;
        var negativeReviews = 0;
        var totalReviews = game.reviews.length;

        for (review in game.reviews)
        {
            if (review.recommended)
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