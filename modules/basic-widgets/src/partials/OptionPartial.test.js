(function () {
    "use strict";

    module("OptionPartial");

    var OptionPartial = $widget.Widget.extend('OptionPartial')
        .addTrait($basicWidgets.BinaryStateful)
        .addTraitAndExtend($basicWidgets.Disableable, 'Disableable')
        .addTraitAndExtend($basicWidgets.OptionPartial)
        .addMethods({
            init: function () {
                $widget.Widget.init.call(this);
                $basicWidgets.BinaryStateful.init.call(this);
                $basicWidgets.Disableable.init.call(this);
                $basicWidgets.OptionPartial.init.call(this);
            },

            afterRender: function () {
                $widget.Widget.afterRender.call(this);
                $basicWidgets.OptionPartial.afterRender.call(this);
            },

            afterStateOn: function () {
                $basicWidgets.Disableable.afterStateOn.call(this);
                $basicWidgets.OptionPartial.afterStateOn.call(this);
            },

            afterStateOff: function () {
                $basicWidgets.Disableable.afterStateOff.call(this);
                $basicWidgets.OptionPartial.afterStateOff.call(this);
            }
        });

    test("Instantiation", function () {
        var option = OptionPartial.create();

        equal(option.tagName, 'option', "should set tagName property");
    });

    test("Disabling", function () {
        var option = OptionPartial.create();

        option.disableBy('foo');

        ok(option.htmlAttributes.getItem('disabled'), "should set disabled attribute");
    });

    test("Enabling", function () {
        var option = OptionPartial.create()
            .disableBy('foo');

        option.enableBy('foo');

        ok(!option.htmlAttributes.getItem('disabled'), "should reset disabled attribute");
    });

    test("Option value getter", function () {
        var option = OptionPartial.create();

        option.addAttribute('value', 'foo');

        equal(option.getValue(), 'foo', "should retrieve value attribute");
    });

    test("Option value setter", function () {
        expect(5);

        var option = OptionPartial.create();

        function onValueChange(event) {
            ok(true, "should trigger value change event");
            equal(event.beforeValue, undefined, "should set beforeValue");
            equal(event.afterValue, 'foo', "should set afterValue");
        }

        option.subscribeTo($basicWidgets.EVENT_SELECTABLE_VALUE_CHANGE, onValueChange);

        strictEqual(option.setValue('foo'), option, "should be chainable");
        equal(option.getValue(), 'foo', "should set option value attribute");

        // should not trigger any further events when setting same value
        option.setValue('foo');

        option.removeMocks();
        option.unsubscribeFrom($basicWidgets.EVENT_SELECTABLE_VALUE_CHANGE, onValueChange);
    });

    // TODO: Extend with events
    test("Selecting option", function () {
        expect(4);

        var option = OptionPartial.create(),
            select = $basicWidgets.SingleSelect.create();

        select.addItemWidget(option);

        function onSelectedChange(event) {
            ok(!event.wasSelected, "should set wasSelected");
            ok(event.isSelected, "should set isSelected");
        }

        option.subscribeTo($basicWidgets.EVENT_SELECTABLE_STATE_CHANGE, onSelectedChange);

        strictEqual(option.select(), option, "should be chainable");
        ok(option.selected, "should add selected attribute");

        option.unsubscribeFrom($basicWidgets.EVENT_SELECTABLE_STATE_CHANGE, onSelectedChange);
    });

    // TODO: Extend with events
    test("Deselecting option", function () {
        expect(4);

        var option = OptionPartial.create(),
            select = $basicWidgets.SingleSelect.create();

        select.addItemWidget(option);
        option.select();

        function onSelectedChange(event) {
            ok(event.wasSelected, "should set wasSelected");
            ok(!event.isSelected, "should set isSelected");
        }

        option.subscribeTo($basicWidgets.EVENT_SELECTABLE_STATE_CHANGE, onSelectedChange);

        option.select();

        strictEqual(option.deselect(), option, "should be chainable");
        ok(!option.selected, "should remove selected attribute");

        option.unsubscribeFrom($basicWidgets.EVENT_SELECTABLE_STATE_CHANGE, onSelectedChange);
    });
}());
