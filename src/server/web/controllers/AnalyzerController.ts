import {Request, Response} from "express";
import {JsonController} from "routing-controllers/decorator/Controllers";
import {Get, Post, Put, Patch, Delete} from "routing-controllers/decorator/Methods";
import {Req, Res, Param} from "routing-controllers/decorator/Params";
import q = require("q");

import {SentimentAnalyzer} from "../analyzers/SentimentAnalyzer";

@JsonController("/analyzer")
export class AnalyzerController
{
    @Get("/")
    public async analyzeSequence(request)
    {
        return await SentimentAnalyzer.analyzeSequence(request.sequence);
    }

    public test(request)
    {
        var def = q.defer();

        setTimeout(() => def.resolve(request.sequence), 3000);

        return def.promise;
    }
}