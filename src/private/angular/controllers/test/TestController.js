angular.module("AngularApp")
    .controller("TestController", function (AppComponentService)
    {
        const self = this;

        self.phrases = [];

        self.sequence = null;

        self.analyze = function ()
        {
            if(!self.sequence)
                return;

            var analyzer = AppComponentService.getModule("app/analyzers/SentimentAnalyzer").SentimentAnalyzer;

            analyzer.analyzeSequence(self.sequence);

            console.log("Async Asserted");
        }
    });