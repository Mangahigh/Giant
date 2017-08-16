(function () {
    "use strict";

    module("StringFilter");

    test("Instantiation", function () {
        var filterFunction = function () {
            },
            stringFilter;

        throws(function () {
            $basicWidgets.StringFilter.create();
        }, "should throw exception on missing arguments");

        throws(function () {
            $basicWidgets.StringFilter.create('foo');
        }, "should throw exception on invalid arguments");

        stringFilter = $basicWidgets.StringFilter.create(filterFunction);
        strictEqual(stringFilter.filterFunction, filterFunction, "should set filterFunction property");
    });

    test("Conversion from function", function () {
        var filterFunction = function () {
            },
            stringFilter = filterFunction.toStringFilter();

        ok(stringFilter.isA($basicWidgets.StringFilter), "should return StringFilter instance");
        strictEqual(stringFilter.filterFunction, filterFunction, "should set filterFunction property");
    });

    test("Filtering", function () {
        var stringFilter = (function (str) {
            return str.toUpperCase();
        }).toStringFilter();

        equal(stringFilter.filter("hello"), "HELLO", "should return filtered string");
    });
}());
