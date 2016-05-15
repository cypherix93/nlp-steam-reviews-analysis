import {DbContext} from "../../database/context/DbContext";
import {ReviewRecommendation} from "../../database/models/training/ReviewRecommendation";
import {Review} from "../../database/models/Review";

export class AccuracyEvaluator
{
    public static async computeAccuracy(appId?:string):Promise<number>
    {
        var query = appId ? {gameId: appId} : {};
        var projection = {_id: true};

        var reviews = await DbContext.reviews.find(query, projection).toArray() as Review[];
        var reviewIds = reviews.map(x => x._id) as string[];

        var trainingRecommendations = await DbContext.trainingRecommendations.find({reviewId: {$in: reviewIds}}) as ReviewRecommendation[];

        var totalCount = 0;
        var correctCount = 0;

        for (let rec of trainingRecommendations)
        {
            let reviewId = rec.reviewId;

            let testingRec = await DbContext.testingRecommendations.findOne({reviewId: reviewId}) as ReviewRecommendation;

            if (!testingRec || testingRec.recommended === null)
                continue;

            if (rec.recommended === testingRec.recommended)
                correctCount++;

            totalCount++;
        }

        return correctCount / totalCount;
    }
}