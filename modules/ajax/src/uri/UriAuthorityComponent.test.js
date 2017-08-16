(function () {
    "use strict";

    module("UriAuthorityComponent");

    test("Instantiation", function () {
        var uriAuthority;

        uriAuthority = $ajax.UriAuthorityComponent.create();
        equal(typeof uriAuthority.userinfo, 'undefined', "should add userinfo property");
        equal(typeof uriAuthority.host, 'undefined', "should add host property");
        equal(typeof uriAuthority.port, 'undefined', "should add port property");

        uriAuthority = $ajax.UriAuthorityComponent.create('john.smith@foo.com:8000');
        equal(uriAuthority.userinfo, 'john.smith', "should set userinfo property");
        equal(uriAuthority.host, 'foo.com', "should set host property");
        equal(uriAuthority.port, '8000', "should set port property");

        uriAuthority = $ajax.UriAuthorityComponent.create('john%2F.smith@foo.com:8000');
        equal(uriAuthority.userinfo, 'john/.smith', "should URI decode parts");
    });

    test("Conversion from string", function () {
        var uriAuthority = 'john.smith@foo.com:8000'.toUriAuthorityComponent();

        ok(uriAuthority.isA($ajax.UriAuthorityComponent), "should return a UriAuthorityComponent instance.");
        equal(uriAuthority.userinfo, 'john.smith', "should set userinfo property");
        equal(uriAuthority.host, 'foo.com', "should set host property");
        equal(uriAuthority.port, '8000', "should set port property");
    });

    test("Emptiness tester", function () {
        ok($ajax.UriAuthorityComponent.create().isEmpty(),
            "should return true when instantiated with undefined");
        ok($ajax.UriAuthorityComponent.create('').isEmpty(),
            "should return true when instantiated with empty string");
        ok(!$ajax.UriAuthorityComponent.create('foo.com').isEmpty(),
            "should return false for any content");
    });

    test("User info setter", function () {
        var uriAuthority = 'john.smith@foo.com:8000'.toUriAuthorityComponent();

        strictEqual(uriAuthority.setUserInfo('jane.miller'), uriAuthority,
            "should be chainable");
        equal(uriAuthority.userinfo, 'jane.miller', "should set userinfo property");
    });

    test("Host setter", function () {
        var uriAuthority = 'john.smith@foo.com:8000'.toUriAuthorityComponent();

        strictEqual(uriAuthority.setHost('bar.org'), uriAuthority,
            "should be chainable");
        equal(uriAuthority.host, 'bar.org', "should set host property");
    });

    test("Port setter", function () {
        var uriAuthority = 'john.smith@foo.com:8000'.toUriAuthorityComponent();

        strictEqual(uriAuthority.setPort('9999'), uriAuthority,
            "should be chainable");
        equal(uriAuthority.port, '9999', "should set port property");
    });

    test("String conversion", function () {
        equal(''.toUriAuthorityComponent().toString(), '',
            "should return empty string for empty path");

        equal('foo.com'.toUriAuthorityComponent().toString(),
            'foo.com',
            "should not include unset userinfo and port");

        equal('john.smith@foo.com:8000'.toUriAuthorityComponent().toString(),
            'john.smith@foo.com:8000',
            "should return reconstructed authority component");

        equal('john%2F.smith@foo.com:8000'.toUriAuthorityComponent().toString(),
            'john%2F.smith@foo.com:8000',
            "should URI encode parts");
    });
}());
