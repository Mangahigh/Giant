(function () {
    "use strict";

    module("Disableable");

    var base = $widget.Widget,
        Disableable = base.extend('Disableable')
            .addTraitAndExtend($basicWidgets.BinaryStateful)
            .addTraitAndExtend($basicWidgets.Disableable)
            .addMethods({
                init: function () {
                    base.init.call(this);
                    $basicWidgets.BinaryStateful.init.call(this);
                    $basicWidgets.Disableable.init.call(this);
                },

                afterAdd: function () {
                    base.afterAdd.call(this);
                    $basicWidgets.BinaryStateful.afterAdd.call(this);
                },

                afterRemove: function () {
                    base.afterRemove.call(this);
                    $basicWidgets.BinaryStateful.afterRemove.call(this);
                }
            });

    test("Instantiation", function () {
        Disableable.addMocks({
            addBinaryState: function (stateName) {
                equal(stateName, $basicWidgets.Disableable.STATE_NAME_DISABLED,
                    "should add disableable state to instance");
            }
        });

        Disableable.create();

        Disableable.removeMocks();
    });

    test("State on handler", function () {
        expect(1);

        var disableable = Disableable.create();

        disableable.addMocks({
            _updateEnabledStyle: function () {
                ok(true, "should update disabled style");
            }
        });

        disableable.afterStateOn('foo');

        disableable.afterStateOn($basicWidgets.Disableable.STATE_NAME_DISABLED);
    });

    test("State off handler", function () {
        expect(1);

        var disableable = Disableable.create();

        disableable.addMocks({
            _updateEnabledStyle: function () {
                ok(true, "should update disabled style");
            }
        });

        disableable.afterStateOff('foo');

        disableable.afterStateOff($basicWidgets.Disableable.STATE_NAME_DISABLED);
    });

    test("Disabling", function () {
        expect(3);

        var disableable = Disableable.create();

        disableable.addMocks({
            addBinaryStateSource: function (stateName, sourceId) {
                equal(stateName, $basicWidgets.Disableable.STATE_NAME_DISABLED,
                    "should add to state by specified name");
                equal(sourceId, 'foo', "should pass specified source ID to state");
            }
        });

        strictEqual(disableable.disableBy('foo'), disableable, "should be chainable");
    });

    test("Disabling", function () {
        expect(3);

        var disableable = Disableable.create();

        disableable.addMocks({
            removeBinaryStateSource: function (stateName, sourceId) {
                equal(stateName, $basicWidgets.Disableable.STATE_NAME_DISABLED,
                    "should remove from state by specified name");
                equal(sourceId, 'foo', "should pass specified source ID to state");
            }
        });

        strictEqual(disableable.enableBy('foo'), disableable, "should be chainable");
    });

    test("Force enable", function () {
        expect(3);

        var disableable = Disableable.create();

        disableable.addMocks({
            removeBinaryStateSource: function (stateName, sourceId) {
                equal(stateName, $basicWidgets.Disableable.STATE_NAME_DISABLED,
                    "should remove from state by specified name");
                equal(typeof sourceId, 'undefined', "should pass undefined as source ID");
            }
        });

        strictEqual(disableable.forceEnable(), disableable, "should be chainable");
    });

    test("Disabled state tester", function () {
        expect(2);

        var disableable = Disableable.create(),
            result;

        disableable.addMocks({
            isStateOn: function (stateName) {
                equal(stateName, $basicWidgets.Disableable.STATE_NAME_DISABLED,
                    "should remove from state by specified name");
                return result;
            }
        });

        strictEqual(
            disableable.isDisabled(),
            result,
            "should return value returned by isStateOn");
    });
}());
