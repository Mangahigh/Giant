(function () {
    "use strict";

    module("TextInput");

    test("Instantiation", function () {
        throws(function () {
            $basicWidgets.TextInput.create('foo');
        }, "should throw exception on invalid input type");

        var input = $basicWidgets.TextInput.create('text');

        equal(input.tagName, 'input', "should set tagName property");
        equal(input.htmlAttributes.getItem('type'), 'text', "should set type HTML attribute");
    });

    test("Input value setter", function () {
        expect(4);

        var input = $basicWidgets.TextInput.create();

        function onValueChange(event) {
            ok(true, "should trigger value change event");
            equal(event.beforeValue, undefined, "should set beforeValue property");
            equal(event.afterValue, 'foo', "should set afterValue property");
        }

        input.subscribeTo($basicWidgets.EVENT_INPUT_VALUE_CHANGE, onValueChange);

        strictEqual(input.setValue('foo'), input, "should be chainable");

        input.unsubscribeFrom($basicWidgets.EVENT_INPUT_VALUE_CHANGE, onValueChange);
    });
}());
