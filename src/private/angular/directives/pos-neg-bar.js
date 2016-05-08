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
                if (scope.pos < 1)
                    scope.pos = scope.pos * 100 | 0;

                if (scope.neg < 1)
                    scope.neg = scope.neg * 100 | 0;
            },
            templateUrl: "templates/shared/pos-neg-bar-template.html"
        }
    });