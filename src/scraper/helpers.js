"use strict";

var jsonfile = require("jsonfile");

// Generate steam api link
exports.generateSteamApiLink = function(appid, n)
{
    return `http://steamcommunity.com/app/${appid}/homecontent/?userreviewsoffset=${(n - 1) * 10}&p=${n}&itemspage=${n}&screenshotspage=${n}&videospage=${n}&artpage=${n}&allguidepage=${n}&webguidepage=${n}&integratedguidepage=${n}&discussionspage=${n}&l=english&appid=${appid}&appHubSubSection=10&browsefilter=toprated&filterLanguage=default&searchText=`;
};

// File write
exports.writeReviewsToFile = function(filename, reviews)
{
    var dir = require("path").parse(filename).dir;
    require("mkdirp").sync(dir);

    jsonfile.writeFileSync(filename, reviews);
};