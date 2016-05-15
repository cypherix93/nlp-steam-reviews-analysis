angular.module("AngularApp")
    .directive("phrase", function ()
    {
        return {
            restrict: "A",
            scope: {
                phrase: "="
            },
            link: function (scope, element, attrs)
            {
                if(!scope.phrase.polarity)
                    scope.colorClass = "text-muted";
                else if(scope.phrase.polarity > 0)
                    scope.colorClass = "text-success";
                else
                    scope.colorClass = "text-danger";

                scope.stringValue = scope.phrase.words
                    .map(function (w)
                    {
                        return w.word;
                    })
                    .join(" ");

                scope.tooltipValue = "";

                for (var i = 0; i < scope.phrase.words.length; i++)
                {
                    var word = scope.phrase.words[i];

                    scope.tooltipValue += word.word + " (" + word.tag + ")<br>";
                }

                if (attrs.polarity)
                    scope.tooltipValue += "<br>Polarity: " + scope.phrase.polarity;
                
                scope.showTooltip = attrs.tooltip;
            },
            templateUrl: "templates/shared/phrase-template.html"
        }
    });