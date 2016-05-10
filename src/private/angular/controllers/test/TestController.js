angular.module("AngularApp")
    .controller("TestController", function (APIService)
    {
        var self = this;

        self.phrases = [];

        self.sequence = null;

        self.analyze = function ()
        {
            if (!self.sequence)
                return;

            APIService.post("analyze/sequence", {sequence: self.sequence})
                .then(function(response)
                {
                    console.log("App returned: " + response);
                });
        }
    });