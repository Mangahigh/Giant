(function () {
    "use strict";

    module("Uri");

    test("Instantiation", function () {
        throws(function () {
            $ajax.Uri.create(1234);
        }, "should throw exception on invalid argument");

        var uri = $ajax.Uri.create('http://www.foo.com:8080/hello/world?bar=baz#quux');

        equal(uri.scheme, 'http', "should set scheme property");
        ok(uri.authority.isA($ajax.UriAuthorityComponent), "should add query property");
        equal(uri.authority.toString(), 'www.foo.com:8080', "should set authority property");
        ok(uri.path.isA($ajax.UriPathComponent), "should add path property");
        equal(uri.path.toString(), 'hello/world', "should set path property");
        ok(uri.query.isA($ajax.UriQueryComponent), "should add query property");
        equal(uri.query.toString(), 'bar=baz', "should set query property");
        equal(uri.fragment, 'quux', "should set fragment property");
    });

    test("Instantiation without argument", function () {
        var uri = $ajax.Uri.create();

        equal(uri.scheme, undefined, "should set scheme property");
        ok(uri.authority.isA($ajax.UriAuthorityComponent), "should add query property");
        ok(uri.path.isA($ajax.UriPathComponent), "should add path property");
        ok(uri.query.isA($ajax.UriQueryComponent), "should add query property");
        equal(uri.query.toString(), '', "should set query property");
        equal(uri.fragment, undefined, "should set fragment property");
    });

    test("Conversion from string", function () {
        var uri = 'http://www.foo.com:8080/hello/world?bar=baz#quux'.toUri();

        ok(uri.isA($ajax.Uri), "should return Uri instance");
        equal(uri.scheme, 'http', "should set scheme property");
        ok(uri.authority.isA($ajax.UriAuthorityComponent), "should add query property");
        equal(uri.authority.toString(), 'www.foo.com:8080', "should set authority property");
        ok(uri.path.isA($ajax.UriPathComponent), "should add path property");
        equal(uri.path.toString(), 'hello/world', "should set path property");
        ok(uri.query.isA($ajax.UriQueryComponent), "should add query property");
        equal(uri.query, 'bar=baz', "should set query property");
        equal(uri.fragment, 'quux', "should set fragment property");
    });

    test("Scheme setter", function () {
        var uri = 'http://www.foo.com'.toUri();

        strictEqual(uri.setScheme('https'), uri, "should be chainable");
        equal(uri.toString(), 'https://www.foo.com',
            "should set scheme component");
    });

    test("Authority setter", function () {
        var uri = 'http://www.foo.com'.toUri();

        strictEqual(uri.setAuthority('bar.org'), uri, "should be chainable");
        ok(uri.authority.isA($ajax.UriAuthorityComponent),
            "should set UriAuthorityComponent instance");
        equal(uri.toString(), 'http://bar.org',
            "should set authority component");
    });

    test("Path setter", function () {
        var uri = 'http://www.foo.com'.toUri();

        strictEqual(uri.setPath('bar/baz'), uri, "should be chainable");
        ok(uri.path.isA($ajax.UriPathComponent),
            "should set UriPathComponent instance");
        equal(uri.toString(), 'http://www.foo.com/bar/baz',
            "should set path component");
    });

    test("Query setter", function () {
        var uri = 'http://www.foo.com'.toUri();

        strictEqual(uri.setQuery('foo=bar'), uri, "should be chainable");
        ok(uri.query.isA($ajax.UriQueryComponent),
            "should set UriQueryComponent instance");
        equal(uri.toString(), 'http://www.foo.com?foo=bar',
            "should set query component");
    });

    test("Fragment setter", function () {
        var uri = 'http://www.foo.com'.toUri();

        strictEqual(uri.setFragment('bar'), uri, "should be chainable");
        equal(uri.toString(), 'http://www.foo.com#bar',
            "should set fragment component");
    });

    test("Cloning", function () {
        var uri = 'http://www.foo.com:8080/hello/world?bar=baz#quux'.toUri(),
            cloned = uri.clone();

        ok(cloned.isA($ajax.Uri), "should return Uri instance");
        notStrictEqual(cloned, uri, "should return different instance");
        deepEqual(cloned, uri, "should hold the same content");
    });

    test("String conversion", function () {
        equal(
            $ajax.Uri.create('http://www.foo.com:8080/hello/world?bar=baz#quux').toString(),
            'http://www.foo.com:8080/hello/world?bar=baz#quux',
            "should return original URI string");

        equal(
            $ajax.Uri.create('http://www.foo.com/hello/world?bar=baz#quux').toString(),
            'http://www.foo.com/hello/world?bar=baz#quux',
            "should leave out port if omitted");

        equal(
            $ajax.Uri.create('http://www.foo.com:8080?bar=baz#quux').toString(),
            'http://www.foo.com:8080?bar=baz#quux',
            "should leave out path if omitted");

        equal(
            $ajax.Uri.create('http://www.foo.com:8080/hello/world#quux').toString(),
            'http://www.foo.com:8080/hello/world#quux',
            "should leave out query if omitted");

        equal(
            $ajax.Uri.create('http://www.foo.com:8080/hello/world?bar=baz').toString(),
            'http://www.foo.com:8080/hello/world?bar=baz',
            "should leave out fragment if omitted");
    });
}());
