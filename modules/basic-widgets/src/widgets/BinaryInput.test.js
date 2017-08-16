(function () {
    "use strict";

    module("BinaryInput");

    test("Instantiation", function () {
        throws(function () {
            $basicWidgets.BinaryInput.create('text');
        }, "should throw exception on invalid argument");

        var input = $basicWidgets.BinaryInput.create('checkbox');

        ok(input.hasOwnProperty('selected'), "should add selected property");
        equal(input.tagName, 'input', "should set tagName property");
        equal(input.htmlAttributes.getItem('type'), 'checkbox', "should set type HTML attribute");
    });

    test("Value setter", function () {
        expect(5);

        var input = $basicWidgets.BinaryInput.create();

        function onValueChange(event) {
            ok(true, "should trigger value change event");
            equal(event.beforeValue, undefined, "should set beforeValue property");
            equal(event.afterValue, 'foo', "should set afterValue property");
        }

        input.subscribeTo($basicWidgets.EVENT_SELECTABLE_VALUE_CHANGE, onValueChange);

        strictEqual(input.setValue('foo'), input, "should be chainable");

        input.unsubscribeFrom($basicWidgets.EVENT_SELECTABLE_VALUE_CHANGE, onValueChange);

        equal(input.htmlAttributes.getItem('value'), 'foo', "should set value attribute");
    });

    test("Value getter", function () {
        var input = $basicWidgets.BinaryInput.create()
            .setValue('foo');

        equal(input.getValue(), 'foo', "should return value attribute");
    });

    test("Selecting", function () {
        expect(6);

        var input = $basicWidgets.BinaryInput.create();

        function onStateChange(event) {
            ok(true, "should trigger value change event");
            strictEqual(event.wasSelected, undefined, "should set wasSelected property");
            equal(event.isSelected, true, "should set isSelected property");
        }

        input.addMocks({
            _syncDomToState: function () {
                ok(true, "should update checked in DOM");
            }
        });

        input.subscribeTo($basicWidgets.EVENT_SELECTABLE_STATE_CHANGE, onStateChange);

        strictEqual(input.select(), input, "should be chainable");

        input.unsubscribeFrom($basicWidgets.EVENT_SELECTABLE_STATE_CHANGE, onStateChange);

        equal(input.selected, true, "should set selected property");
    });

    test("Checked state removal", function () {
        expect(6);

        var input = $basicWidgets.BinaryInput.create()
            .select();

        function onStateChange(event) {
            ok(true, "should trigger value change event");
            equal(event.wasSelected, true, "should set wasSelected property");
            strictEqual(event.isSelected, false, "should set isSelected property");
        }

        input.addMocks({
            _syncDomToState: function () {
                ok(true, "should update checked in DOM");
            }
        });

        input.subscribeTo($basicWidgets.EVENT_SELECTABLE_STATE_CHANGE, onStateChange);

        strictEqual(input.deselect(), input, "should be chainable");

        input.unsubscribeFrom($basicWidgets.EVENT_SELECTABLE_STATE_CHANGE, onStateChange);

        equal(input.selected, false, "should set selected property");
    });
}());
