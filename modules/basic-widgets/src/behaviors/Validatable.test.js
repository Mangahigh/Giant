(function () {
    "use strict";

    module("Validatable");

    var Validatable = $widget.Widget.extend('Validatable')
        .addTraitAndExtend($basicWidgets.DomValuable)
        .addTraitAndExtend($basicWidgets.Validatable)
        .addMethods({
            init: function () {
                $widget.Widget.init.call(this);
                $basicWidgets.DomValuable.init.call(this);
                $basicWidgets.Validatable.init.call(this);
            },
            afterAdd: function () {
                $widget.Widget.afterAdd.call(this);
                $basicWidgets.Validatable.afterAdd.call(this);
            },
            afterRender: function () {
                $widget.Widget.afterRender.call(this);
                $basicWidgets.DomValuable.afterRender.call(this);
            }
        });

    test("Instantiation", function () {
        var validatable = Validatable.create();
        ok(validatable.hasOwnProperty('validator'), "should add validator property");
        ok(validatable.hasOwnProperty('isValid'), "should add isValid property");
    });

    test("Validator setter", function () {
        expect(4);

        var validatable = Validatable.create(),
            validator = function () {
            };

        throws(function () {
            validatable.setValidator('foo');
        }, "should throw exception on invalid argument");

        validatable.addMocks({
            _updateValidity: function () {
                ok(true, "should update validity");
            }
        });

        strictEqual(validatable.setValidator(validator), validatable, "should be chainable");
        strictEqual(validatable.validator, validator, "should set validator property");
    });

    test("Validity getter", function () {
        var validatable = Validatable.create();

        ok(validatable.getValidity(), "should return true when no validator is specified");

        validatable.setValidator(function (value) {
            return !value || value.length < 2;
        });

        validatable.value = 'a';
        ok(validatable.getValidity(), "should return true on valid value");

        validatable.value = 'foo';
        ok(!validatable.getValidity(), "should return false on invalid value");
    });

    test("Input value change handler", function () {
        expect(1);

        var input = Validatable.create();

        input.afterAdd();

        input.addMocks({
            _updateValidity: function () {
                ok(true, "should update validity");
            }
        });

        input.setValue('bar');

        input.afterRemove();
    });

    test("Input validity change handler", function () {
        expect(1);

        var input = Validatable.create()
            .setValidator(function (value) {
                return !value || value.length < 2;
            })
            .setValue('f');

        input.afterAdd();

        input.addMocks({
            _updateValidityStyle: function () {
                ok(true, "should update validity style");
            }
        });

        input.setValue('bar');

        input.afterRemove();
    });
}());
