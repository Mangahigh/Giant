(function () {
    "use strict";

    module("Highlightable");

    var base = $widget.Widget,
        Highlightable = base.extend('Highlightable')
            .addTraitAndExtend($commonWidgets.BinaryStateful)
            .addTraitAndExtend($commonWidgets.Highlightable)
            .addMethods({
                init: function () {
                    base.init.call(this);
                    $commonWidgets.BinaryStateful.init.call(this);
                    $commonWidgets.Highlightable.init.call(this);
                },

                afterAdd: function () {
                    base.afterAdd.call(this);
                    $commonWidgets.BinaryStateful.afterAdd.call(this);
                },

                afterRemove: function () {
                    base.afterRemove.call(this);
                    $commonWidgets.BinaryStateful.afterRemove.call(this);
                }
            });

    test("Instantiation", function () {
        Highlightable.addMocks({
            addBinaryState: function (stateName) {
                equal(stateName, $commonWidgets.Highlightable.STATE_NAME_HIGHLIGHTABLE,
                    "should add highlightable state to instance");
            }
        });

        var highlightable = Highlightable.create();

        Highlightable.removeMocks();

        ok(highlightable.highlightIds.isA($data.Collection), "should add highlightIds property");
        equal(highlightable.highlightIds.getKeyCount(), 0,
            "should initialize highlightIds to empty collection");
    });

    test("Binary state addition", function () {
        expect(4);

        var highlightable = Highlightable.create();

        $commonWidgets.BinaryStateful.addMocks({
            addBinaryStateSource: function (stateName, sourceId) {
                equal(stateName, 'foo', "should pass state name to super");
                equal(sourceId, 'bar', "should pass source ID to super");
            }
        });

        highlightable.addMocks({
            _updateHighlightedState: function () {
                ok(true, "should update highlighted state");
            }
        });

        strictEqual(highlightable.addBinaryStateSource('foo', 'bar'), highlightable,
            "should be chainable");

        $commonWidgets.BinaryStateful.removeMocks();

        highlightable.addBinaryStateSource($commonWidgets.Highlightable.STATE_NAME_HIGHLIGHTABLE, 'bar');
    });

    test("Imposed state addition", function () {
        expect(3);

        var highlightable = Highlightable.create();

        $commonWidgets.BinaryStateful.addMocks({
            addImposedStateSource: function (stateName) {
                equal(stateName, 'foo', "should pass state name to super");
            }
        });

        highlightable.addMocks({
            _updateHighlightedState: function () {
                ok(true, "should update highlighted state");
            }
        });

        strictEqual(highlightable.addImposedStateSource('foo'), highlightable,
            "should be chainable");

        $commonWidgets.BinaryStateful.removeMocks();

        highlightable.addImposedStateSource($commonWidgets.Highlightable.STATE_NAME_HIGHLIGHTABLE);
    });

    test("Binary state removal", function () {
        expect(4);

        var highlightable = Highlightable.create();

        $commonWidgets.BinaryStateful.addMocks({
            removeBinaryStateSource: function (stateName, sourceId) {
                equal(stateName, 'foo', "should pass state name to super");
                equal(sourceId, 'bar', "should pass source ID to super");
            }
        });

        highlightable.addMocks({
            _updateHighlightedState: function () {
                ok(true, "should update highlighted state");
            }
        });

        strictEqual(highlightable.removeBinaryStateSource('foo', 'bar'), highlightable,
            "should be chainable");

        $commonWidgets.BinaryStateful.removeMocks();

        highlightable.removeBinaryStateSource($commonWidgets.Highlightable.STATE_NAME_HIGHLIGHTABLE, 'bar');
    });

    test("Imposed state removal", function () {
        expect(3);

        var highlightable = Highlightable.create();

        $commonWidgets.BinaryStateful.addMocks({
            removeImposedStateSource: function (stateName) {
                equal(stateName, 'foo', "should pass state name to super");
            }
        });

        highlightable.addMocks({
            _updateHighlightedState: function () {
                ok(true, "should update highlighted state");
            }
        });

        strictEqual(highlightable.removeImposedStateSource('foo'), highlightable,
            "should be chainable");

        $commonWidgets.BinaryStateful.removeMocks();

        highlightable.removeImposedStateSource($commonWidgets.Highlightable.STATE_NAME_HIGHLIGHTABLE);
    });

    test("Highlight on", function () {
        var highlightable = Highlightable.create(),
            result = [];

        throws(function () {
            highlightable.highlightOn(123);
        }, "should raise exception on invalid argument");

        highlightable.addMocks({
            addBinaryStateSource: function (stateName, sourceId) {
                result.push([stateName, sourceId]);
            }
        });

        strictEqual(highlightable.highlightOn('foo'), highlightable, "should be chainable");
        highlightable.highlightOn();

        deepEqual(result, [
            ['state-highlightable', 'foo'],
            ['state-highlightable', 'highlighted']
        ], "should add specified or default sources");
    });

    test("Highlight off", function () {
        var highlightable = Highlightable.create(),
            result = [];

        throws(function () {
            highlightable.highlightOff(123);
        }, "should raise exception on invalid argument");

        highlightable.addMocks({
            removeBinaryStateSource: function (stateName, sourceId) {
                result.push([stateName, sourceId]);
            }
        });

        strictEqual(highlightable.highlightOff('foo'), highlightable, "should be chainable");
        highlightable.highlightOff();

        deepEqual(result, [
            ['state-highlightable', 'foo'],
            ['state-highlightable', 'highlighted']
        ], "should remove specified or default sources");
    });

    test("Highlighted state tester", function () {
        var highlightable = Highlightable.create()
            .highlightOn('foo');

        throws(function () {
            highlightable.isHighlighted(123);
        }, "should raise exception on invalid argument");

        ok(!highlightable.isHighlighted('bar'), "should return false for absent source");
        ok(highlightable.isHighlighted('foo'), "should return true for present source");
        ok(highlightable.isHighlighted(), "should return true for no source at non-zero sources");
    });
}());
