(function () {
    "use strict";

    module("SelectSelectionChangeEvent");

    test("Instantiation", function () {
        var event = $basicWidgets.SelectSelectionChangeEvent.create(
            'widget.change.select.selection',
            $widget.widgetEventSpace);

        ok(event.hasOwnProperty('beforeValues'), "should add beforeValues property");
        ok(event.hasOwnProperty('afterValues'), "should add afterValues property");
        ok(event.hasOwnProperty('selectedValues'), "should add selectedValues property");
        ok(event.hasOwnProperty('deselectedValues'), "should add deselectedValues property");
    });

    test("Event surrogate", function () {
        var event = $event.Event.create('widget.change.select.selection', $widget.widgetEventSpace);
        ok(event.isA($basicWidgets.SelectSelectionChangeEvent),
            "should return SelectSelectionChangeEvent instance");
    });

    test("Before values setter", function () {
        var event = $widget.widgetEventSpace.spawnEvent('widget.change.select.selection');
        strictEqual(event.setBeforeValues(['foo'].toCollection()), event, "should be chainable");
        deepEqual(event.beforeValues.items, ['foo'], "should set beforeValues property");
    });

    test("After values setter", function () {
        var event = $widget.widgetEventSpace.spawnEvent('widget.change.select.selection');
        strictEqual(event.setAfterValues(['foo'].toCollection()), event, "should be chainable");
        deepEqual(event.afterValues.items, ['foo'], "should set afterValues property");
    });

    test("Selected values setter", function () {
        var event = $widget.widgetEventSpace.spawnEvent('widget.change.select.selection');
        strictEqual(event.setSelectedValues(['foo'].toCollection()), event, "should be chainable");
        deepEqual(event.selectedValues.items, ['foo'], "should set selectedValues property");
    });

    test("Deselected values setter", function () {
        var event = $widget.widgetEventSpace.spawnEvent('widget.change.select.selection');
        strictEqual(event.setDeselectedValues(['foo'].toCollection()), event, "should be chainable");
        deepEqual(event.deselectedValues.items, ['foo'], "should set deselectedValues property");
    });

    test("Cloning", function () {
        var event = $widget.widgetEventSpace.spawnEvent('widget.change.select.selection')
            .setBeforeValues(['foo'].toCollection())
            .setAfterValues(['bar'].toCollection())
            .setSelectedValues(['baz'].toCollection())
            .setDeselectedValues(['quux'].toCollection()),
            clone = event.clone('baz'.toPath());

        ok(clone.isA($basicWidgets.SelectSelectionChangeEvent), "should return SelectSelectionChangeEvent");
        deepEqual(clone.beforeValues.items, event.beforeValues.items, "should copy beforeValues property");
        deepEqual(clone.afterValues.items, event.afterValues.items, "should copy afterValues property");
        deepEqual(clone.selectedValues.items, event.selectedValues.items, "should copy selectedValues property");
        deepEqual(clone.deselectedValues.items, event.deselectedValues.items, "should copy deselectedValues property");
    });
}());
