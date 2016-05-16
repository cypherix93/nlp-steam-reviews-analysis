angular.module("AngularApp")
    .controller("ReviewsController", function ReviewsController($stateParams, APIService)
    {
        var self = this;

        var appId = $stateParams.appId;
        var page = $stateParams.page || 1;

        APIService.get("/reviews/get/" + $stateParams.appId + "/" + page)
            .success(function(response)
            {
                self.reviews = response;
            });
    });