(function () {
    "use strict";

    module("UriPathComponent");

    test("Instantiation", function () {
        var uriPath;

        uriPath = $ajax.UriPathComponent.create('');
        ok(uriPath.path.isA($data.Path), "should add path property");
        deepEqual(uriPath.path.asArray, [], "should set empty path as empty Path instance");

        uriPath = $ajax.UriPathComponent.create('foo/bar/baz');
        ok(uriPath.path.equals('foo>bar>baz'.toPath()), "should set path property");

        uriPath = $ajax.UriPathComponent.create('foo%2F/bar/baz');
        deepEqual(uriPath.path.asArray, ['foo/', 'bar', 'baz'], "should URI decode parts");
    });

    test("Conversion from string", function () {
        var uriPath = 'foo/bar/baz'.toUriPathComponent();

        ok(uriPath.isA($ajax.UriPathComponent), "should return a UriPathComponent instance.");
        ok(uriPath.path.equals('foo>bar>baz'.toPath()), "should set path property");
    });

    test("Emptiness tester", function () {
        ok($ajax.UriPathComponent.create().isEmpty(),
            "should return true when instantiated with undefined");
        ok($ajax.UriPathComponent.create('').isEmpty(),
            "should return true when instantiated with empty string");
        ok(!$ajax.UriPathComponent.create('foo/bar/baz').isEmpty(),
            "should return false for any content");
    });

    test("String conversion", function () {
        equal(''.toUriPathComponent().toString(), '',
            "should return empty string for empty path");

        equal('foo/bar/baz'.toUriPathComponent().toString(),
            'foo/bar/baz',
            "should return reconstructed path");

        equal('foo%2F/bar/baz'.toUriPathComponent().toString(),
            'foo%2F/bar/baz',
            "should URI encode fields and values");
    });
}());
