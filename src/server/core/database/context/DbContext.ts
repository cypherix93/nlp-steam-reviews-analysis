const mongo = require("promised-mongo");

import {Config} from "../../config/Config";

export class DbContext
{
    public static get context()
    {
        return mongo(Config.current.db.connectionString, [
            "games",
            "reviews",
            "training_recommendations",
            "testing_recommendations",
            "training_phrases"
        ]);
    }
    public static get games()
    {
        return DbContext.context.games;
    }
    public static get reviews()
    {
        return DbContext.context.reviews;
    }
    public static get trainingRecommendations()
    {
        return DbContext.context.training_recommendations;
    }
    public static get testingRecommendations()
    {
        return DbContext.context.testing_recommendations;
    }
    public static get trainingPhrases()
    {
        return DbContext.context.training_phrases;
    }
}