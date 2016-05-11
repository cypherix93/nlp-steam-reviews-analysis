import path = require("path");
import fs = require("fs");
import lowdb = require("lowdb");
import storage = require("lowdb/file-sync");

import {Config} from "../../config/Config";

export class DbContext
{
    private static dbLocation:string = path.join(Config.current.rootPath, "../../data/db.json");

    public static context = lowdb(DbContext.dbLocation, {storage}, false);

    public static get games()
    {
        return DbContext.context("games");
    }

    public static get reviews()
    {
        return DbContext.context("reviews");
    }
    public static get phrases()
    {
        return DbContext.context("phrases");
    }
}