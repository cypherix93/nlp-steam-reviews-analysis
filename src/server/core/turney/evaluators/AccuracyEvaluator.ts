import {DbContext} from "../../database/context/DbContext";
import {ReviewRecommendation} from "../../database/models/training/ReviewRecommendation";

export class AccuracyEvaluator
{
    public static async computeAccuracy(appId?:string):Promise<number>
    {
        var query = appId ? {gameId: appId} : {};

        var trainingRecommendations = await DbContext.trainingRecommendations.find(query) as ReviewRecommendation[];

        var testingRecommendations = DbContext.testingRecommendations;

        var totalCount = 0;
        var correctCount = 0;

        for (let rec of trainingRecommendations)
        {
            let reviewId = rec.reviewId;

            let testingRec = await testingRecommendations.findOne({reviewId: reviewId}) as ReviewRecommendation;

            if (!testingRec || testingRec.recommended === null)
                continue;

            if (rec.recommended === testingRec.recommended)
                correctCount++;

            totalCount++;
        }

        return correctCount / totalCount;
    }
}