(function () {
    "use strict";

    module("DomInputable");

    var DomInputable = $widget.Widget.extend('DomInputable')
        .addTraitAndExtend($basicWidgets.BinaryStateful)
        .addTraitAndExtend($basicWidgets.Disableable, 'Disableable')
        .addTraitAndExtend($basicWidgets.DomInputable)
        .addMethods({
            init           : function (inputType) {
                $widget.Widget.init.call(this);
                $basicWidgets.BinaryStateful.init.call(this);
                $basicWidgets.Disableable.init.call(this);
            },
            afterAdd       : function () {
                $widget.Widget.afterAdd.call(this);
                $basicWidgets.BinaryStateful.afterAdd.call(this);
                $basicWidgets.DomInputable.afterAdd.call(this);
            },
            afterRemove    : function () {
                $widget.Widget.afterRemove.call(this);
                $basicWidgets.BinaryStateful.afterRemove.call(this);
            },
            afterStateOn   : function (stateName) {
                $basicWidgets.Disableable.afterStateOn.call(this, stateName);
                $basicWidgets.DomInputable.afterStateOn.call(this, stateName);
            },
            afterStateOff  : function (stateName) {
                $basicWidgets.Disableable.afterStateOff.call(this, stateName);
                $basicWidgets.DomInputable.afterStateOff.call(this, stateName);
            }
        });

    test("State-on handler override", function () {
        expect(1);

        var input = DomInputable.create();

        input.addMocks({
            _updateDisabledAttribute: function () {
                ok(true, "should update disabled attribute");
            }
        });

        input.disableBy('foo');
    });

    test("State-off handler override", function () {
        expect(1);

        var input = DomInputable.create()
            .disableBy('foo');

        input.addMocks({
            _updateDisabledAttribute: function () {
                ok(true, "should update disabled attribute");
            }
        });

        input.enableBy('foo');
    });
    test("Label widget setter", function () {
        var input = DomInputable.create(),
            label = $basicWidgets.Text.create();

        strictEqual(input.linkLabelWidget(label), input, "should be chainable");
        equal(label.tagName, 'label', "should change label tagName property to 'label'");
        equal(label.htmlAttributes.getItem('for'), input.htmlAttributes.idAttribute,
            "should set 'for' attribute to input ID");
    });
    test("DomInputable name setter", function () {
        expect(3);

        var input = DomInputable.create();

        input.addMocks({
            _updateDisabledState: function () {
                ok(true, "should update disbled state");
            }
        });

        strictEqual(input.setName('foo'), input, "should be chainable");
        equal(input.htmlAttributes.getItem('name'), 'foo', "should set name attribute");
    });

    test("DomInputable name removal", function () {
        expect(3);

        var input = DomInputable.create();

        input.addMocks({
            _updateDisabledState: function () {
                ok(true, "should update disbled state");
            },

            removeAttribute: function (attrName) {
                equal(attrName, 'name', "should remove name attribute");
            }
        });

        strictEqual(input.clearName(), input, "should be chainable");
    });

    test("DomInputable name getter", function () {
        var input = DomInputable.create()
            .setName('foo');

        equal(input.getName(), 'foo', "should return name attribute");
    });
}());
