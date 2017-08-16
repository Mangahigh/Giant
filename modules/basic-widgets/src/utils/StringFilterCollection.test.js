(function () {
    "use strict";

    module("StringFilterCollection");

    test("Filtering", function () {
        var stringFilter = $basicWidgets.StringFilterCollection.create({
            "B-uppercase": (function (str) {
                return str.toUpperCase();
            }).toStringFilter(),

            "A-extra-letter": (function (str) {
                return str.split('').join('x');
            }).toStringFilter()
        });

        equal(stringFilter.filter("hello"), "HXEXLXLXO", "should apply filters in order of filter IDs");
    });
}());
