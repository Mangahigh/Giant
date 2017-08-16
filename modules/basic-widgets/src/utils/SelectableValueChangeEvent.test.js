(function () {
    "use strict";

    module("SelectableValueChangeEvent");

    test("Instantiation", function () {
        var event = $basicWidgets.SelectableValueChangeEvent.create(
            'widget.change.selectable.value',
            $widget.widgetEventSpace);

        ok(event.hasOwnProperty('beforeValue'), "should add beforeValue property");
        ok(event.hasOwnProperty('afterValue'), "should add afterValue property");
    });

    test("Event surrogate", function () {
        var event = $event.Event.create('widget.change.selectable.value', $widget.widgetEventSpace);
        ok(event.isA($basicWidgets.SelectableValueChangeEvent),
            "should return SelectableValueChangeEvent instance");
    });

    test("Before value setter", function () {
        var event = $widget.widgetEventSpace.spawnEvent('widget.change.selectable.value');
        strictEqual(event.setBeforeValue('foo'), event, "should be chainable");
        equal(event.beforeValue, 'foo', "should set beforeValue property");
    });

    test("After value setter", function () {
        var event = $widget.widgetEventSpace.spawnEvent('widget.change.selectable.value');
        strictEqual(event.setAfterValue('foo'), event, "should be chainable");
        equal(event.afterValue, 'foo', "should set afterValue property");
    });

    test("Cloning", function () {
        var event = $widget.widgetEventSpace.spawnEvent('widget.change.selectable.value')
            .setBeforeValue('foo')
            .setAfterValue('bar'),
            clone = event.clone('baz'.toPath());

        ok(clone.isA($basicWidgets.SelectableValueChangeEvent), "should return SelectableValueChangeEvent");
        equal(clone.beforeValue, event.beforeValue, "should copy beforeValue property");
        equal(clone.afterValue, event.afterValue, "should copy afterValue property");
    });
}());
