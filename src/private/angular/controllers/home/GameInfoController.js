angular.module("AngularApp")
    .controller("GameInfoController", function GameInfoController(GameDataService, $stateParams)
    {
        const self = this;
        self.game = GameDataService.getGameById($stateParams.appId);
        self.badFeatures = ["Poop", "Makes", "the", "World", "Poopier"];
        self.goodFeatures = ["#Naranja", "#Nuhlupah", "#Fedora", "#SameJeans", "#Community"];
        self.topReviews = ["Alison Brie", "is", "so", "hot", "i agree"];
        self.positive = 69;
        self.negative = 31;
        self.reviewsCount = 666;
    });