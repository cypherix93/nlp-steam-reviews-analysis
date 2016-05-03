import {Request, Response} from "express";
import {JsonController} from "routing-controllers/decorator/Controllers";
import {Get, Post, Put, Patch, Delete} from "routing-controllers/decorator/Methods";
import {Req, Res} from "routing-controllers/decorator/Params";

import {Article} from "../../core/database/models/Article";

@JsonController("/articles")
export class PostsController
{
    @Get("/")
    public getAll()
    {
        var posts = [];

        posts.push(new Article("How To Do Typescript", "cypherix93"));
        posts.push(new Article("How To Do AngularJS", "cypherix93"));
        posts.push(new Article("How To Do Gulp", "cypherix93"));
        posts.push(new Article("How To Do Web Dev", "cypherix93"));
        posts.push(new Article("How To Do Stuff", "cypherix93"));

        return posts;
    }

    @Get("/:id")
    public getOne()
    {

    }
}