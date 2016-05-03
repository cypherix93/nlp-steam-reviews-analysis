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
    // Gotta actually parse the review here

    return reviewData;
}