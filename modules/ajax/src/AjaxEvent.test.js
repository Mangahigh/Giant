(function () {
    "use strict";

    module("AjaxEvent");

    test("Instantiation", function () {
        var ajaxEvent = $ajax.AjaxEvent.create('foo', $event.eventSpace);
        ok(ajaxEvent.hasOwnProperty('xhr'), "should add xhr property");
    });

    test("Event surrogate", function () {
        ok($event.Event.create('ajax.foo', $event.eventSpace).isA($ajax.AjaxEvent),
            "should return AjaxEvent instance");
    });

    test("Spawning event", function () {
        ok($event.eventSpace.spawnEvent('ajax.foo').isA($ajax.AjaxEvent),
            "should return AjaxEvent instance");
    });

    test("Cloning", function () {
        var xhr = {},
            serviceEvent = $event.Event.create('ajax.foo', $event.eventSpace)
                .setXhr(xhr),
            result;

        result = serviceEvent.clone('foo>bar'.toPath());

        ok(result.isA($ajax.AjaxEvent), "should return AjaxEvent instance");
        notStrictEqual(result, serviceEvent, "should return a different AjaxEvent instance");
        strictEqual(result.xhr, xhr, "should set xhr property on clone");
    });
}());
