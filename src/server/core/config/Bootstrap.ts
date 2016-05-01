import bodyParser = require("body-parser");

import {RoutesConfig} from "./routes/RoutesConfig";

export class Bootstrap
{
    public static init(app)
    {
        console.log("=> Bootstrapping application...");

        // Configure express middlewares
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));

        // Setup routes
        RoutesConfig.init(app);
    }
}