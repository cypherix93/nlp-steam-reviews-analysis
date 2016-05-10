import {Request, Response} from "express";
import {JsonController} from "routing-controllers/decorator/Controllers";
import {Get, Post} from "routing-controllers/decorator/Methods";
import {Req, Res} from "routing-controllers/decorator/Params";
import q = require("q");

import {SentimentAnalyzer} from "../analyzers/SentimentAnalyzer";

@JsonController("/analyze")
export class AnalyzerController
{
    @Post("/")
    public async analyzeSequence(@Req() request: Request)
    {
        return await SentimentAnalyzer.analyzeSequence(request.body.sequence);
    }
}