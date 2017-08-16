(function () {
    "use strict";

    module("GruntProxy", {
        setup   : function () {
            $gruntTools.GruntProxy.clearInstanceRegistry();
        },
        teardown: function () {
            $gruntTools.GruntProxy.clearInstanceRegistry();
        }
    });

    test("Instantiation", function () {
        var gruntProxy = $gruntTools.GruntProxy.create();

        ok(gruntProxy.hasOwnProperty('grunt'), "should add grunt property");
        equal(typeof gruntProxy.grunt, 'undefined', "should set grunt property to undefined");

        strictEqual($gruntTools.GruntProxy.create(), gruntProxy, "should be singleton");
    });

    test("Grunt object setter", function () {
        var gruntProxy = $gruntTools.GruntProxy.create(),
            gruntObject = {};

        throws(function () {
            gruntProxy.setGruntObject();
        }, "should raise exception on missing argument");

        throws(function () {
            gruntProxy.setGruntObject('foo');
        }, "should raise exception on invalid argument");

        strictEqual(gruntProxy.setGruntObject(gruntObject), gruntProxy, "should be chainable");
        strictEqual(gruntProxy.grunt, gruntObject, "should set grunt object");
    });
}());
