angular.module("AngularApp")
    .service("ConstantsService", function ConstantsService()
    {
        var self = this;

        self.apiBaseUrl = "http://localhost:31363";
    });