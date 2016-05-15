angular.module("AngularApp")
    .directive("posNegBar", function()
    {
        return {
            restrict: "EA",
            scope: {
                pos: "=",
                neg: "="
            },
            link: function(scope, element, attrs)
            {
                if (scope.pos === 0 && scope.neg === 0)
                {
                    scope.empty = true;
                }
            },
            templateUrl: "templates/shared/pos-neg-bar-template.html"
        }
    });