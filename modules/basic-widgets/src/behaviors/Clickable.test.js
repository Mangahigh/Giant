(function () {
    "use strict";

    module("Clickable");

    var base = $widget.Widget,
        Clickable = base.extend('Clickable')
            .addTraitAndExtend($basicWidgets.Clickable)
            .addMethods({
                init: function () {
                    base.init.call(this);
                    $basicWidgets.Clickable.init.call(this);
                },

                afterRender: function () {
                    base.afterRender.call(this);
                    $basicWidgets.Clickable.afterRender.call(this);
                }
            });

    test("Click emulation", function () {
        expect(2);

        var clickable = Clickable.create();

        clickable.addMocks({
            triggerSync: function (eventName) {
                equal(eventName, $basicWidgets.EVENT_CLICKABLE_CLICK,
                    "should trigger click event");
            }
        });

        strictEqual(clickable.click(), clickable, "should be chainable");
    });
}());
