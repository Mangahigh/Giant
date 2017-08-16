(function () {
    "use strict";

    module("EntityInputPartial");

    var EntityInputPartial = $basicWidgets.TextInput.extend('EntityInputPartial')
        .addTraitAndExtend($entity.EntityBound)
        .addTraitAndExtend($basicWidgets.EntityInputPartial)
        .addMethods({
            init: function (valueKey, nameKey) {
                $basicWidgets.TextInput.init.call(this, 'text');
                $entity.EntityBound.init.call(this);
                $basicWidgets.EntityInputPartial.init.call(this, valueKey, nameKey);
            },
            afterAdd: function () {
                $basicWidgets.TextInput.afterAdd.call(this);
                $basicWidgets.EntityInputPartial.afterAdd.call(this);
            },
            afterRemove: function () {
                $basicWidgets.TextInput.afterRemove.call(this);
                $basicWidgets.EntityInputPartial.afterRemove.call(this);
            }
        });

    test("Value change handler", function () {
        expect(1);

        var input = EntityInputPartial.create('input/1/value'.toFieldKey());

        'input/1'.toDocument().unsetNode();

        input.afterAdd();

        input.addMocks({
            _syncInputValueToEntity: function () {
                ok(true, "should sync input value to entity");
            }
        });

        'input/1/value'.toField().setValue('bar');

        input.afterRemove();
    });

    test("Name change handler", function () {
        expect(1);

        var input = EntityInputPartial.create('input/1/value'.toFieldKey(), 'input/1/name'.toFieldKey());

        'input/1'.toDocument().unsetNode();

        input.afterAdd();

        input.addMocks({
            _syncInputNameToEntity: function () {
                ok(true, "should sync input name to entity");
            }
        });

        'input/1/name'.toField().setValue('foo');

        input.afterRemove();
    });
}());
