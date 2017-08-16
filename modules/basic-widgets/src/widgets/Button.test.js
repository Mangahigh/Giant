(function () {
    "use strict";

    module("Button");

    test("Click emulation", function () {
        expect(2);

        var button = $basicWidgets.Button.create();

        button.addMocks({
            triggerSync: function (eventName) {
                equal(eventName, $basicWidgets.EVENT_CLICKABLE_CLICK,
                    "should trigger click event");
            }
        });

        strictEqual(button.click(), button, "should be chainable");

        button.disableBy('foo');

        // should not trigger click when disabled
        button.click();
    });

    test("Disabling", function () {
        var button = $basicWidgets.Button.create()
            .disableBy('foo');

        equal(button.htmlAttributes.getItem('disabled'), 'disabled', "should set disabled attribute");
    });

    test("Enabling", function () {
        var button = $basicWidgets.Button.create()
            .disableBy('foo')
            .enableBy('foo');

        equal(button.htmlAttributes.getItem('disabled'), undefined, "should remove disabled attribute");
    });
}());
