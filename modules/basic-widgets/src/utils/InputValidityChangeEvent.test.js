(function () {
    "use strict";

    module("InputValidityChangeEvent");

    test("Instantiation", function () {
        var event = $basicWidgets.InputValidityChangeEvent.create(
            'widget.change.input.validity',
            $widget.widgetEventSpace);

        ok(event.hasOwnProperty('wasValid'), "should add wasValid property");
        ok(event.hasOwnProperty('isValid'), "should add isValid property");
    });

    test("Event surrogate", function () {
        var event = $event.Event.create('widget.change.input.validity', $widget.widgetEventSpace);
        ok(event.isA($basicWidgets.InputValidityChangeEvent),
            "should return InputValidityChangeEvent instance");
    });

    test("Before value setter", function () {
        var event = $widget.widgetEventSpace.spawnEvent('widget.change.input.validity');
        strictEqual(event.setWasValid(true), event, "should be chainable");
        equal(event.wasValid, true, "should set wasValid property");
    });

    test("After value setter", function () {
        var event = $widget.widgetEventSpace.spawnEvent('widget.change.input.validity');
        strictEqual(event.setIsValid(false), event, "should be chainable");
        equal(event.isValid, false, "should set isValid property");
    });

    test("Cloning", function () {
        var event = $widget.widgetEventSpace.spawnEvent('widget.change.input.validity')
            .setWasValid(false)
            .setIsValid(true),
            clone = event.clone('baz'.toPath());

        ok(clone.isA($basicWidgets.InputValidityChangeEvent), "should return InputValidityChangeEvent");
        equal(clone.wasValid, event.wasValid, "should copy wasValid property");
        equal(clone.isValid, event.isValid, "should copy isValid property");
    });
}());
