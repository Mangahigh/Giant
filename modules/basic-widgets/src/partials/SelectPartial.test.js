(function () {
    "use strict";

    module("SelectPartial");

    var SelectPartial = $basicWidgets.List.extend('SelectPartial')
        .addTrait($basicWidgets.SelectPartial)
        .addMethods({
            init: function () {
                $basicWidgets.List.init.call(this);
                $basicWidgets.SelectPartial.init.call(this);
            }
        });

    test("Instantiation", function () {
        var select = SelectPartial.create();
        equal(select.tagName, 'select', "should set tagName property");
    });

    test("Item widget addition", function () {
        var select = SelectPartial.create();

        throws(function () {
            select.addItemWidget();
        }, "should throw exception on missing option argument");

        throws(function () {
            select.addItemWidget($widget.Widget.create());
        }, "should throw exception on invalid option argument");
    });
}());
