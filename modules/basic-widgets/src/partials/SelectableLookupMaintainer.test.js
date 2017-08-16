(function () {
    "use strict";

    module("SelectableLookupMaintainer");

    var SelectableLookupMaintainer = $basicWidgets.List.extend('SelectableLookupMaintainer')
        .addTraitAndExtend($basicWidgets.SelectableLookupMaintainer)
        .addMethods({
            init: function () {
                $basicWidgets.List.init.call(this);
                $basicWidgets.SelectableLookupMaintainer.init.call(this);

                this.setTagName('div');
            },

            afterAdd: function () {
                $basicWidgets.List.afterAdd.call(this);
                $basicWidgets.SelectableLookupMaintainer.afterAdd.call(this);
            },

            addItemWidget: function (itemWidget) {
                $basicWidgets.List.addItemWidget.call(this, itemWidget);
                $basicWidgets.SelectableLookupMaintainer.addItemWidget.call(this, itemWidget);
                return this;
            },

            removeItemWidget: function (itemWidget) {
                $basicWidgets.List.removeItemWidget.call(this, itemWidget);
                $basicWidgets.SelectableLookupMaintainer.removeItemWidget.call(this, itemWidget);
                return this;
            }
        });

    test("Instantiation", function () {
        var select = SelectableLookupMaintainer.create();

        ok(select.itemWidgetsByValue.isA($data.Collection),
            "should add itemWidgetsByValue property");
    });

    test("Item widget addition", function () {
        var select = SelectableLookupMaintainer.create();

        var option = $basicWidgets.Option.create()
            .setValue('foo');

        strictEqual(select.addItemWidget(option), select, "should be chainable");
        deepEqual(select.itemWidgetsByValue.items, {
            foo: option
        }, "should add item widget to lookup");

        throws(function () {
            select.addItemWidget($basicWidgets.Option.create()
                .setValue('foo'));
        }, "should throw exception on adding duplicate");
    });

    test("Item widget removal", function () {
        var option = $basicWidgets.Option.create()
            .setValue('foo'),
            select = SelectableLookupMaintainer.create()
                .addItemWidget(option);

        strictEqual(select.removeItemWidget(option), select, "should be chainable");
        deepEqual(select.itemWidgetsByValue.items, {}, "should remove item widget from lookup");
    });

    test("Option widget getter", function () {
        var option1 = $basicWidgets.Option.create()
            .setValue('foo'),
            option2 = $basicWidgets.Option.create()
                .setValue('bar'),
            select = SelectableLookupMaintainer.create()
                .addItemWidget(option1)
                .addItemWidget(option2);

        strictEqual(select.getItemWidgetByValue('bar'), option2,
            "should return option instance with specified value");
    });

    test("Option value change handler", function () {
        var option1 = $basicWidgets.Option.create()
            .setValue('foo'),
            option2 = $basicWidgets.Option.create()
                .setValue('bar'),
            select = SelectableLookupMaintainer.create()
                .addItemWidget(option1)
                .addItemWidget(option2)
                .addToParent($basicWidgets.Application.create());

        option2.setValue('baz');

        throws(function () {
            option2.setValue('foo');
        }, "should throw exception on existing target value");

        select.removeFromParent();
    });
}());
