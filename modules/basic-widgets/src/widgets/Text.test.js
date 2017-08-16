(function () {
    "use strict";

    module("Text");

    test("Instantiation", function () {
        var text = $basicWidgets.Text.create();
        equal(typeof text.contentString, 'undefined', "should add contentString property");
    });

    test("Content string setter", function () {
        expect(3);

        var text = $basicWidgets.Text.create();

        text.addMocks({
            reRenderContents: function () {
                ok(true, "should update DOM");
            },

            _updateStyle: function () {
                ok(true, "should update CSS");
            }
        });

        // should not trigger any changes
        text.setContentString("foo");

        equal(text.contentString, "foo", "should set contentString property");
    });

    test("Html escape setter", function () {
        expect(1);

        var text = $basicWidgets.Text.create();

        text.addMocks({
            reRenderContents: function () {
                ok(true, "should re-render widget contents");
            }
        });

        text.setHtmlEscaped(false);
    });
}());
