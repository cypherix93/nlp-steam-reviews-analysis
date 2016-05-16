angular.module("AngularApp")
    .service("ReviewsAnnotaterService", function ReviewsAnnotaterService($sce)
    {
        var self = this;

        self.annotateReviews = function (reviews)
        {
            var result = [];
            for (var i = 0; i < reviews.length; i++)
            {
                var review = reviews[i];
                result.push(self.annotateReview(review));
            }
            return result;
        };

        self.annotateReview = function (review)
        {
            var phrases = review.recommendations.test.phrases;

            if (!phrases || !phrases.length)
                return review;

            var annotated = review.reviewBody;

            for (var i = 0; i < phrases.length; i++)
            {
                var phrase = phrases[i];

                var searchText = phrase.words
                    .map(function (w)
                    {
                        return w.word;
                    })
                    .join(" ");

                var colorClass;
                if (!phrase.polarity)
                    colorClass = "text-muted";
                else if (phrase.polarity > 0)
                    colorClass = "text-success";
                else
                    colorClass = "text-danger";

                var replaceText = "<span class='" + colorClass + "' title='" + phrase.polarity + "' data-toggle='tooltip' data-placement='top'>" +
                    searchText + "</span>";

                annotated = annotated.replace(new RegExp("(" + searchText + ")", "gi"), replaceText);
            }

            review.reviewBody = $sce.trustAsHtml(annotated);

            return review;
        };
    });