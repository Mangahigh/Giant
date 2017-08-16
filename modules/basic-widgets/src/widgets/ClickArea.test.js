(function () {
    "use strict";

    module("ClickArea");

    test("Click emulation", function () {
        expect(2);

        var clickArea = $basicWidgets.ClickArea.create();

        clickArea.addMocks({
            triggerSync: function (eventName) {
                equal(eventName, $basicWidgets.EVENT_CLICKABLE_CLICK,
                    "should trigger click event");
            }
        });

        strictEqual(clickArea.click(), clickArea, "should be chainable");

        clickArea.disableBy('foo');

        // should not trigger click when disabled
        clickArea.click();
    });
}());
