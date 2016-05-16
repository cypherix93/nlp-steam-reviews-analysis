angular.module("AngularApp")
    .controller("ReviewsController", function ReviewsController($stateParams, $state, APIService)
    {
        var self = this;

        self.appId = $stateParams.appId;
        self.page = $stateParams.page || 1;

        APIService.get("/reviews/get/" + self.appId + "/" + self.page)
            .success(function (response)
            {
                self.game = response.game;
                self.reviews = response.reviews;
                self.counts = response.counts;
            });

        self.changePage = function ()
        {
            $state.go("reviews", {
                appId: self.appId,
                page: self.page
            });
        }
    });