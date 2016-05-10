angular.module("AngularApp")
    .controller("TestController", function (IPCService)
    {
        const self = this;

        self.phrases = [];

        self.sequence = null;

        self.analyze = function ()
        {
            if(!self.sequence)
                return;

            IPCService.send("analyzer/analyzeSequence", { sequence: self.sequence})
                .then((response) =>
                {
                    console.log("App returned: " + response);
                });
            
            console.log("Async Asserted");
        }
    });