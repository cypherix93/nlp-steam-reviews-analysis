"use strict";

// Node stuff
const path = require("path");
const fs = require("fs");
const jsonfile = require("jsonfile");

// LowDB stuff
const lowdb = require("lowdb");
const storage = require("lowdb/file-sync");

// Directories
const dataDir = path.join(__dirname, "../../data");
const scraperDir = path.join(dataDir, "scraper");

// Init db
const dbLocation = path.join(dataDir, "db.json");
const db = lowdb(dbLocation, {storage}, false);

// Recreate Reviews table
db.object.reviews = [];
const dbReviews = db("reviews");

// Loop through all games in scraped dir
var gameDirs = fs.readdirSync(scraperDir);
for (let gameDir of gameDirs)
{
    var gamePath = path.join(scraperDir, gameDir);
    var dataFiles = fs.readdirSync(gamePath);
    
    for (let file of dataFiles)
    {
        var filePath = path.join(gamePath, file);

        // Get the file's data
        var fileData = jsonfile.readFileSync(filePath);
        var reviews = parseFile(fileData);

        // Write to DB
        reviews.forEach(r => dbReviews.push(r));
        db.write();
    }
}

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
    result = result.substring(1);

    return result;
}

function parseHoursPlayed(hoursPlayedLine)
{
    var pattern = /(\d+\.\d+) hrs on record/g;
    var matches = pattern.exec(hoursPlayedLine);

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