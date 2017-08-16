(function () {
    "use strict";

    module("MultiSelect");

    test("Instantiation", function () {
        var select = $basicWidgets.MultiSelect.create();
        ok(select.selectedValues.isA($data.Collection), "should add selectedValues property");
    });

    test("DOM change handler", function () {
        expect(1);

        var element = {},
            option = $basicWidgets.Option.create()
                .setValue('foo'),
            select = $basicWidgets.MultiSelect.create()
                .addItemWidget(option);

        select.addMocks({
            _selectedOptionsGetterProxy: function () {
                return [element];
            },

            _valueGetterProxy: function () {
                return 'foo';
            }
        });

        option.addMocks({
            select: function () {
                equal(this.getValue(), 'foo', "should select matching option widget");
            }
        });

        select.onChange({});
    });

    test("Option value change handler", function (assert) {
        expect(3);

        var done = assert.async(),
            option1 = $basicWidgets.Option.create()
                .setValue('foo'),
            option2 = $basicWidgets.Option.create()
                .setValue('bar'),
            select = $basicWidgets.MultiSelect.create()
                .addItemWidget(option1)
                .addItemWidget(option2)
                .addToParent($basicWidgets.Application.create());

        function onSelectionChange(event) {
            ok(true, "should trigger event about change");
            deepEqual(event.beforeValues.items, {}, "should send before values to event");
            deepEqual(event.afterValues.items, {
                foo: 'foo',
                baz: 'baz'
            }, "should send before values to event");

            // cleaning up
            select.unsubscribeFrom($basicWidgets.EVENT_SELECT_SELECTION_CHANGE, onSelectionChange);
            select.removeFromParent();

            done();
        }

        select.subscribeTo($basicWidgets.EVENT_SELECT_SELECTION_CHANGE, onSelectionChange);

        option1.select();
        option2.select();
        option2.setValue('baz');
    });

    test("Multiple option selected state change handler", function (assert) {
        expect(3);

        var done = assert.async(),
            option1 = $basicWidgets.Option.create()
                .setValue('foo'),
            option2 = $basicWidgets.Option.create()
                .setValue('bar'),
            select = $basicWidgets.MultiSelect.create()
                .addItemWidget(option1)
                .addItemWidget(option2)
                .addToParent($basicWidgets.Application.create());

        function onSelectionChange(event) {
            ok(true, "should trigger event about change");
            deepEqual(event.beforeValues.items, {}, "should send before values to event");
            deepEqual(event.afterValues.items, {
                foo: 'foo',
                bar: 'bar'
            }, "should send before values to event");

            // cleaning up
            select.unsubscribeFrom($basicWidgets.EVENT_SELECT_SELECTION_CHANGE, onSelectionChange);
            select.removeFromParent();

            done();
        }

        select.subscribeTo($basicWidgets.EVENT_SELECT_SELECTION_CHANGE, onSelectionChange);

        option1.select();
        option2.select();
    });
}());
