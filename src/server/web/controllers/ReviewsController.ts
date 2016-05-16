import {Request, Response} from "express";
import {JsonController} from "routing-controllers/decorator/Controllers";
import {Get, Post} from "routing-controllers/decorator/Methods";
import {Req, Res} from "routing-controllers/decorator/Params";

import {ReviewsRepository} from "../repositories/ReviewsRepository";
import {Review} from "../../core/database/models/Review";
import {GameRepository} from "../repositories/GamesRepository";

@JsonController("/reviews")
export class ReviewsController
{
    @Get("/get/:appId/:page")
    public async getForWidgets(@Req() request:Request):Promise<{}>
    {
        var appId = request.params.appId;
        var page = request.params.page || 1;

        var reviewPage = await ReviewsRepository.getReviewsPage(appId, page);
        var game = await GameRepository.getById(appId);

        return {
            reviews: reviewPage.reviews,
            counts: {
                total: reviewPage.reviewsCount
            },
            game: {
                title: game.title,
                appId: game.appId
            }
        }
    }
}