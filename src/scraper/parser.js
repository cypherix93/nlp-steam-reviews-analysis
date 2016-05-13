"use strict";

// Node stuff
const path = require("path");
const fs = require("fs");
const jsonfile = require("jsonfile");

// MongoDB stuff
var db = require("promised-mongo")("mongodb://localhost:27017/nlp-steam-reviews-analysis");

// Directories
const dataDir = path.join(__dirname, "../../data");
const scraperDir = path.join(dataDir, "scraper");

// Apps file
const apps = require("./apps.json");

// Main function
(function()
{

    // Drop create all the tables
    const dbReviews = db.reviews;
    const dbGames = db.games;
    const dbTraining = db.training_recommendations;

    dbReviews.remove();
    dbGames.remove();

    // Loop through all games in scraped dir
    var gameDirs = fs.readdirSync(scraperDir);
    for (let gameDir of gameDirs)
    {
        let gamePath = path.join(scraperDir, gameDir);
        let dataFiles = fs.readdirSync(gamePath);

        // Save the game in its collection
        let game = {
            title: apps.filter(x => x.id === (gameDir | 0)).map(x => x.game)[0],
            appId: gameDir
        };

        dbGames.save(game);

        // Then save all the reviews for the game
        for (let file of dataFiles)
        {
            console.log(`Parsing file '${file}' of ${game.title} (${game.appId})...`);

            let filePath = path.join(gamePath, file);

            // Get the file's data
            let fileData = jsonfile.readFileSync(filePath);

            // Parse the file's data and add to DB
            let parsedReviews = parseFile(fileData);

            // Write to DB
            parsedReviews.forEach(r =>
            {
                // Set game Id
                r.gameId = gameDir;

                // Save the recommended flag in temp
                let recommended = r.recommended;
                delete r.recommended;

                // Save the review
                dbReviews.save(r)
                    .then(review =>
                    {
                        // Save the training recommendation
                        dbTraining.save({
                            reviewId: review._id,
                            recommended: recommended
                        });
                    });
            });
        }
    }

    // Close mongo connection
    db = null;
})();

function parseFile(fileData)
{
    var reviews = [];

    for (let singleReview of fileData)
    {
        reviews.push(parseReview(singleReview));
    }

    return reviews;
}

function parseReview(reviewData)
{
    var reviewParsed = {
        reviewer: null,
        reviewBody: null,
        reviewerHoursPlayed: null,
        datePosted: null,
        recommended: null,
        reviewVotes: {
            foundHelpful: null,
            totalVotes: null,
            foundHelpfulPercentage: null,
            foundFunny: null
        }
    };

    // Reviewer Name
    reviewParsed.reviewer = reviewData.reviewerName;

    // Review body
    reviewParsed.reviewBody = parseReviewBody(reviewData.reviewBody);

    // Reviewer Hours Played
    reviewParsed.reviewerHoursPlayed = parseHoursPlayed(reviewData.hours);

    // Review Date Posted
    reviewParsed.datePosted = parseReviewDate(reviewData.date_posted);

    // Review Recommended or not
    reviewParsed.recommended = (reviewData.title === "Recommended");

    // Parse the review votes
    reviewParsed.reviewVotes = parseReviewVotes(reviewData.found_helpful);

    return reviewParsed;
}

/* Helper Functions */
function parseReviewBody(reviewBodyLine)
{
    var result = reviewBodyLine.replace(/(\n+|\t+)/g, "");
    result = result.replace(/<br>/g, "\n");

    // Remove the first newline
    if(result[0] === "\n")
        result = result.substring(1);

    return result;
}

function parseHoursPlayed(hoursPlayedLine)
{
    var pattern = /(\d+\.\d+) hrs on record/g;
    var matches = pattern.exec(hoursPlayedLine);

    if (!matches)
        return 0;

    return parseFloat(matches[1]);
}

function parseReviewDate(reviewDateLine)
{
    var result = reviewDateLine.replace(/Posted: /g, "");

    var pattern = /(January|February|March|April|May|June|July|August|September|October|November|December) (\d+)(, (\d+))?/g;
    var matches = pattern.exec(result);

    if (!matches)
        return null;

    var month = matches[1];
    var day = matches[2];
    var year = matches[4] || new Date().getFullYear();

    return new Date(`${year}-${month}-${day}`);
}

function parseReviewVotes(foundHelpfulLine)
{
    var pattern = /(\d+) of (\d+) people \((\d+)%\) found this review helpful(<br>(\d+) people found this review funny)?/g;
    var matches = pattern.exec(foundHelpfulLine);
    
    if (!matches)
        return {};

    var foundHelpful = matches[1] | 0;
    var totalVotes = matches[2] | 0;
    var foundHelpfulPercentage = foundHelpful / totalVotes;
    var foundFunny = matches[5] | 0;

    return {
        foundHelpful,
        totalVotes,
        foundHelpfulPercentage,
        foundFunny
    };
}