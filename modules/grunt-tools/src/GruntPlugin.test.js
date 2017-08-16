(function () {
    "use strict";

    module("GruntPlugin");

    test("Instantiation", function () {
        throws(function () {
            $gruntTools.GruntPlugin.create();
        }, "should raise exception on missing arguments");

        var plugin = $gruntTools.GruntPlugin.create('foo');

        equal(plugin.packageName, 'foo', "should set packageName property");
    });

    test("Conversion from string", function () {
        var plugin = 'foo'.toGruntPlugin();

        ok(plugin.isA($gruntTools.GruntPlugin), "should return GruntPlugin instance");
        equal(plugin.packageName, 'foo', "should set packageName property");
    });

    test("Loading plugin", function () {
        expect(2);

        $gruntTools.GruntProxy.addMocks({
            loadNpmTasks: function (npmTaskName) {
                equal(npmTaskName, 'foo', "should load module via grunt");
            }
        });

        var plugin = $gruntTools.GruntPlugin.create('foo');

        strictEqual(plugin.loadPlugin(), plugin, "should be chainable");

        $gruntTools.GruntProxy.removeMocks();
    });
}());
