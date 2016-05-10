import bodyParser = require("body-parser");

import {RoutesConfig} from "./routes/RoutesConfig";
import {Express} from "express";

export class Bootstrapper
{
    public static bootstrap(app:Express)
    {
        console.log("=> Bootstrapping application...");

        // Configure express middlewares
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));

        // Setup routes
        RoutesConfig.init(app);
    }
}