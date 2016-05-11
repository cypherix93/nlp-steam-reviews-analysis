const mongo = require("promised-mongo");

import {Config} from "../../config/Config";

export class DbContext
{
    public static get context()
    {
        return mongo(Config.current.db.connectionString);
    }

    public static get games()
    {
        return DbContext.context.games;
    }

    public static get reviews()
    {
        return DbContext.context.reviews;
    }
}