(function () {
    "use strict";

    module("UriQueryComponent");

    test("Instantiation", function () {
        var uriQuery;

        uriQuery = $ajax.UriQueryComponent.create('foo bar baz');
        deepEqual(uriQuery.dictionary.items, {}, "should return empty dictionary for invalid query string");

        uriQuery = $ajax.UriQueryComponent.create('foo=bar&foo=baz&quux=1');
        deepEqual(uriQuery.dictionary.items, {
            foo : ['bar', 'baz'],
            quux: '1'
        }, "should return dictionary with results");

        uriQuery = $ajax.UriQueryComponent.create('foo=bar');
        deepEqual(uriQuery.dictionary.items, {
            foo : 'bar'
        }, "should work with single field-value pair");

        uriQuery = $ajax.UriQueryComponent.create('foo%3D=bar%26&baz%26=quux%3D');
        deepEqual(uriQuery.dictionary.items, {
            'foo=': 'bar&',
            'baz&': 'quux='
        }, "should URI decode fields and values");
    });

    test("Conversion from string", function () {
        var uriQuery = 'foo=bar&foo=baz&quux=1'.toUriQueryComponent();

        ok(uriQuery.isA($ajax.UriQueryComponent), "should return a UriQueryComponent instance.");
        deepEqual(uriQuery.dictionary.items, {
            foo : ['bar', 'baz'],
            quux: '1'
        }, "should return dictionary with results");
    });

    test("Emptiness tester", function () {
        ok($ajax.UriQueryComponent.create().isEmpty(),
            "should return false when instantiated with undefined");
        ok($ajax.UriQueryComponent.create('').isEmpty(),
            "should return false when instantiated with empty string");
        ok(!$ajax.UriQueryComponent.create('foo=bar').isEmpty(),
            "should return true for query content");
    });

    test("Parameter addition", function () {
        var uriQuery = ''.toUriQueryComponent();

        strictEqual(uriQuery.addQueryParam('foo', 'bar'), uriQuery, "should be chainable");
        equal(uriQuery.toString(), 'foo=bar',
            "should add specified parameter");
    });

    test("Multiple parameter addition", function () {
        var uriQuery = ''.toUriQueryComponent();

        strictEqual(uriQuery.addQueryParams({
            foo: 'bar',
            baz: ['quux', '1']
        }), uriQuery, "should be chainable");
        equal(uriQuery.toString(), 'foo=bar&baz=quux&baz=1',
            "should add specified parameters");
    });

    test("String conversion", function () {
        equal($ajax.UriQueryComponent.create('').toString(), '',
            "should return empty string for empty dictionary");

        equal($ajax.UriQueryComponent.create('foo=bar&foo=baz&quux=1'),
            'foo=bar&foo=baz&quux=1',
            "should return reconstructed query string");

        equal($ajax.UriQueryComponent.create('foo%3D=bar%26&baz%26=quux%3D'),
            'foo%3D=bar%26&baz%26=quux%3D',
            "should URI encode fields and values");
    });
}());
