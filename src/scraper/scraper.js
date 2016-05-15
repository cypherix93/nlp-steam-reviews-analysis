"use strict";

var request = require("request");
var jsdom = require("jsdom");
var q = require("q");

var apps = require("./apps.json");
var helpers = require("./helpers");

// Init to setup jquery
function init()
{
    var deferred = q.defer();

    jsdom.env("", function (err, window)
    {
        if (err)
        {
            console.error(err);
            return;
        }

        var jquery = require("jquery")(window);

        deferred.resolve(jquery);
    });

    return deferred.promise;
}

// jQuery global
var $;

// Init the stuff
init().then(function (jquery)
{
    $ = jquery;
    
    for (let app of apps)
    {
        getReviews(app);
    }
});

function getReviews(app)
{
    var makeRequest = function (page, tries)
    {
        console.log(`Scraping reviews for AppID:${app.game} (${app.id}) on Page ${page}`);

        var url = helpers.generateSteamApiLink(app.id, page);

        request(url, function (error, response, body)
        {
            if (error)
            {
                console.error(error);
                return;
            }

            if (!body)
            {
                if(!tries || tries < 3)
                {
                    console.log(`==> Trying page ${page} again for ${app.game} (${app.id})!`);
                    console.log(url);
                    makeRequest(page, (tries || 0) + 1);
                }
                else if(tries > 3 &&  tries < 6)
                {
                    console.log(`==> Skipping page ${page} for ${app.game} (${app.id})!`);
                    console.log(url);
                    makeRequest(page + 1, (tries || 0) + 1);
                }

                console.log(`==> Done scraping: ${app.game} (${app.id})`);
                return;
            }

            scrape(body)
                .then(function (reviews)
                {
                    // Write scraped data to file
                    helpers.writeReviewsToFile(`./data/scraper/${app.id}/scraped-${page}.json`, reviews);

                    makeRequest(page + 1);
                })
                .catch(function (err)
                {
                    console.error(err);
                });
        });
    };

    makeRequest(2);
}

// Scrape function for the entire review page
function scrape(htmlData)
{
    var def = q.defer();

    var reviews = [];

    // Get page
    var page = $(htmlData);

    // Loop through all reviews in page
    page.find(".apphub_Card").each(function ()
    {
        var reviewHtml = $(this);

        var reviewData = parseReviewContent(reviewHtml);

        reviews.push(reviewData);

        def.resolve(reviews);
    });

    return def.promise;
}

// Parse function for each review block
function parseReviewContent(reviewHtml)
{
    var reviewData = {
        found_helpful: "",
        title: "",
        hours: "",
        date_posted: "",
        reviewBody: "",
        reviewerName: ""
    };

    var userReviewCardContent = reviewHtml.find(".apphub_UserReviewCardContent");

    reviewData.found_helpful = userReviewCardContent.find(".found_helpful").html();

    var vote_header = userReviewCardContent.find(".vote_header");
    reviewData.title = vote_header.find(".reviewInfo .title").text();
    reviewData.hours = vote_header.find(".reviewInfo .hours").text();

    var cardTextContent = userReviewCardContent.find(".apphub_CardTextContent");
    reviewData.date_posted = cardTextContent.find(".date_posted").text();

    cardTextContent.find("div").remove();
    reviewData.reviewBody = cardTextContent.html();

    var authorBlock = reviewHtml.find(".apphub_CardContentAuthorBlock");
    reviewData.reviewerName = authorBlock.find(".apphub_CardContentAuthorName a").text();

    return reviewData;
}

