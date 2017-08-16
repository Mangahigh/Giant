(function () {
    "use strict";

    module("Formattable");

    var Formattable = $widget.Widget.extend('Formattable')
        .addTraitAndExtend($basicWidgets.Formattable)
        .addMethods({
            init: function () {
                $widget.Widget.init.call(this);
                $basicWidgets.Formattable.init.call(this);
            },

            getOriginalString: function () {
                return "hello";
            }
        });

    test("Instantiation", function () {
        var formattable = Formattable.create();
        ok(formattable.stringFilters.isA($basicWidgets.StringFilterCollection),
            "should set stringFilters property");
        ok(formattable.activeStringFilterIds.isA($data.Collection),
            "should set activeStringFilterIds property");
    });

    test("Formatter addition", function () {
        var formattable = Formattable.create(),
            stringFilter = (function (str) {
                return str.toUpperCase();
            }).toStringFilter();

        strictEqual(formattable.addFormatter('foo', stringFilter), formattable,
            "should be chainable");
        strictEqual(formattable.stringFilters.getItem('foo'), stringFilter,
            "should set string filter in collection chainable");
        ok(formattable.activeStringFilterIds.getItem('foo'),
            "should activate filter by default");

        formattable.addFormatter('bar', stringFilter, false);
        ok(!formattable.activeStringFilterIds.getItem('bar'),
            "should NOT activate filter wen so specified");
    });

    test("Formatter activation", function () {
        expect(3);

        var formattable = Formattable.create()
            .addFormatter('foo', (function (str) {
                return str.toUpperCase();
            }).toStringFilter(), false);

        formattable.addMocks({
            reRenderContents: function () {
                ok(true, "should apply filters");
            }
        });

        strictEqual(formattable.activateFormatter('foo'), formattable,
            "should be chainable");
        ok(formattable.activeStringFilterIds.getItem('foo'),
            "should add filter to active filters");
    });

    test("Formatter deactivation", function () {
        expect(3);

        var formattable = Formattable.create()
            .addFormatter('foo', (function (str) {
                return str.toUpperCase();
            }).toStringFilter());

        formattable.addMocks({
            reRenderContents: function () {
                ok(true, "should apply filters");
            }
        });

        strictEqual(formattable.deactivateFormatter('foo'), formattable,
            "should be chainable");
        ok(!formattable.activeStringFilterIds.getItem('foo'),
            "should remove filter from active filters");
    });

    test("Formatted string getter", function () {
        var formattable = Formattable.create()
            // activated
            .addFormatter('foo', (function (str) {
                return str.toUpperCase();
            }).toStringFilter())

            // deactivated
            .addFormatter('bar', (function (str) {
                return str.split('').join(' ');
            }).toStringFilter(), false);

        equal(formattable.getFormattedString(), "HELLO",
            "should apply active filters only");
    });

    test("Filters application", function () {
        expect(2);

        var formattable = Formattable.create()
            .addFormatter('foo', (function (str) {
                return str.toUpperCase();
            }).toStringFilter());

        formattable.addMocks({
            getElement: function () {
                return {};
            },

            setDomString: function (formattedString) {
                equal(formattedString, 'HELLO',
                    "should set formatted string in DOM");
            }
        });

        strictEqual(formattable.reRenderContents(), formattable, "should be chainable");
    });
}());
