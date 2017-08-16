(function () {
    "use strict";

    module("ValueLink");

    test("Instantiation", function () {
        var link = $data.ValueLink.create();

        ok(link.hasOwnProperty('value'), "should add value property");
    });

    test("Value setter", function () {
        var link = $data.ValueLink.create(),
            value = {};

        strictEqual(link.setValue(value), link, "should be chainable");
        strictEqual(link.value, value, "should set value property");
    });
}());
