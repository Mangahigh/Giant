(function () {
    "use strict";

    module("DataOption");

    test("Instantiation", function () {
        throws(function () {
            $basicWidgets.DataOption.create('option/1/description'.toFieldKey(), 'foo');
        }, "should throw exception on invalid arguments");
    });

    test("Value change handler", function () {
        expect(2);

        var option = $basicWidgets.DataOption.create(
            'option/1/description'.toFieldKey(),
            'option/1/value'.toFieldKey());

        'option/1'.toDocument().setNode({
            value      : 'foo',
            description: 'FOO'
        });

        option.afterAdd();

        option.addMocks({
            _syncValueToEntity: function () {
                ok(true, "should sync value to entity when value field changes");
            }
        });

        'option/1/value'.toField().setValue('bar');

        option
            .removeMocks()
            .addMocks({
                _syncValueToEntity: function () {
                    ok(true, "should sync value to entity when option document gets replaced");
                }
            });

        'option/1'.toDocument().setNode({
            value      : 'baz',
            description: 'FOO'
        });
    });
}());
