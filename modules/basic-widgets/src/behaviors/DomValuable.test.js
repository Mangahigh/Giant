(function () {
    "use strict";

    module("DomValuable");

    var DomValuable = $widget.Widget.extend('DomValuable')
        .addTraitAndExtend($basicWidgets.DomValuable)
        .addMethods({
            init: function () {
                $widget.Widget.init.call(this);
                $basicWidgets.DomValuable.init.call(this);
            },
            afterRender: function () {
                $widget.Widget.afterRender.call(this);
                $basicWidgets.DomValuable.afterRender.call(this);
            }
        });

    test("Instantiation", function () {
        var valuable = DomValuable.create();
        ok(valuable.hasOwnProperty('value'), "should add value property");
    });

    test("Value setter", function () {
        expect(3);

        var valuable = DomValuable.create();

        valuable.addMocks({
            _updateDomValue: function () {
                ok(true, "should update value in DOM");
            }
        });

        strictEqual(valuable.setValue('foo'), valuable, "should be chainable");
        equal(valuable.value, 'foo', "should set value property");
    });
}());
