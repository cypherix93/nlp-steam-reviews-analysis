import {Request, Response} from "express";
import {JsonController} from "routing-controllers/decorator/Controllers";
import {Get, Post} from "routing-controllers/decorator/Methods";
import {Req, Res} from "routing-controllers/decorator/Params";
import {SentimentAnalyzer} from "../../core/turney/analyzers/SentimentAnalyzer";

@JsonController("/analyze")
export class AnalyzerController
{
    @Post("/sequence")
    public async sequence(@Req() request: Request)
    {
        var sequence = request.body.sequence;

        return await SentimentAnalyzer.analyzeSequence(sequence);
    }

    @Get("/game/:appId")
    public async game(@Req() request: Request)
    {
        var appId = request.params.appId;

        await SentimentAnalyzer.analyzeGame(appId);

        return "Analyzed game with AppID " + appId;
    }
}