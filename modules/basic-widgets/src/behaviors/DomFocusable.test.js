(function () {
    "use strict";

    module("DomFocusable");

    var DomFocusable = $widget.Widget.extend('DomFocusable')
        .addTraitAndExtend($basicWidgets.DomFocusable)
        .addMethods({
            init: function () {
                $widget.Widget.init.call(this);
                $basicWidgets.DomFocusable.init.call(this);
            },
            afterRender: function () {
                $widget.Widget.afterRender.call(this);
                $basicWidgets.DomFocusable.afterRender.call(this);
            }
        });

    test("Focusing", function () {
        expect(2);

        var input = DomFocusable.create(),
            inputElement = document.createElement('input');

        input.addMocks({
            getElement: function () {
                return inputElement;
            },

            _focusProxy: function (element) {
                strictEqual(element, inputElement, "should invoke focus proxy on input element");
            }
        });

        strictEqual(input.focus(), input, "should be chainable");
    });

    test("Blurring", function () {
        expect(2);

        var input = DomFocusable.create(),
            inputElement = document.createElement('input');

        input.addMocks({
            getElement: function () {
                return inputElement;
            },

            _blurProxy: function (element) {
                strictEqual(element, inputElement, "should invoke blur proxy on input element");
            }
        });

        strictEqual(input.blur(), input, "should be chainable");
    });

    test("Focus getter", function () {
        var input = DomFocusable.create(),
            inputElement = document.createElement('input');

        input.addMocks({
            getElement: function () {
                return inputElement;
            },

            _activeElementGetterProxy: function () {
                return inputElement;
            }
        });

        ok(input.isFocused(), "should return true when input element is active");

        input
            .removeMocks()
            .addMocks({
                getElement: function () {
                    return inputElement;
                },

                _activeElementGetterProxy: function () {
                    return 'foo';
                }
            });

        ok(!input.isFocused(), "should return false when input element is inactive");
    });
}());
