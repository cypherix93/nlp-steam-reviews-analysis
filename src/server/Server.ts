/// <reference path="../../typings/main.d.ts" />

import express = require("express");

import {Config} from "./core/config/Config";

// Initialize Config for the current environment
Config.init(process.env.NODE_ENV = process.env.NODE_ENV || "development");

import {Bootstrap} from "./core/config/Bootstrap";

export class Server
{
    public static main()
    {
        var app = express();

        // Bootstrap the application and couple the middlewares
        Bootstrap.init(app);

        // Start up the server
        console.log("=> Starting Server...");

        var port = Config.current.port;
        app.listen(port, function ()
        {
            console.log("\nMagic is happening at http://localhost:" + port);
        });
    }
}
// Start app
Server.main();