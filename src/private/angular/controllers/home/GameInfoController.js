angular.module("AngularApp")
    .controller("GameInfoController", function GameInfoController(APIService, $stateParams)
    {
        var self = this;

        APIService.post("/game/getById", {id: $stateParams.appId})
            .success(function(response)
            {
                self.game = response;   
            });

        self.badFeatures = ["Poop", "Makes", "the", "World", "Poopier"];
        self.goodFeatures = ["#Naranja", "#Nuhlupah", "#Fedora", "#SameJeans", "#Community"];
        self.topReviews = ["Such a disapointmet... Flatout 1/2/UC are one of my favourite racing games, but this game is just terrible. Graphics are worse than in Flatout 2, but it lags as hell, even though my pc runs Crysis 2 on high settings without any problem. Music is worse, physics and camera are much worse, interface feels very uncomfortable. The only good thing about it is that it doesn't have GFWL support, when the UC did. Overall it is a really, really bad game. It wouldn't be such a big deal for me, if it wasn't a sequel to flatout games, but, unfortunately, it is and it makes it the worst game i have played in a last few years.",
            "Read the forum first ! If you've played the other flatout games first and think this is the same bewarned  it's not. It's a really poor attempt to cash in on the previous game's success. Also for some reason my gamepad suffers from dreadful input lag. Can i be bothered to search for a cure... no, not really. I will write the cash of as a bad investment and make a mental note to read the forum first before buying anymore of steam special offers.\nSteam you should really look at what your offering people! \nCheap does not always = bargain. :(",
            "This game does not deserve to be named FlatOut.\n\nIt was NOT made by BugBear. \nI'm not being an arrogant ♥♥♥ when I say that it looks more like it was made by your 10yo brother as his first attempt at making a game.\n\nFlatOut 2 is the one you want. FO Ultimate  Carnage is an upgraded version of FO2 with both benefits and downsides.\nI'll go and say I like FO2 better because the Bullet GT was ... well ... nerfed, I guess... Too bad, they could have buffed the other cars instead =/",
            "this  game is a complete ripoff, I want my money back, I want the time I wasted downloading back.\nI want someone at steam to feel the pain I feel for being ripped of by them It's like a kick in the nuts.\nluckily it was the summer sale and they only ripped me off for half the price of this garbage.\nI believe I may have made my last steam purchase.",
            "If you were a fan of the origional Flatout Series, this Isn't the game you're looking for. This game has an arcade type of feel versues the origional Flatout's more realistic feel, and quite frankly I hate it."];
        self.positive = 69;
        self.negative = 31;
        self.reviewsCount = 666;
    });