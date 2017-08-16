(function () {
    "use strict";

    module("CliArgument");

    test("Instantiation", function () {
        throws(function () {
            $cliTools.CliArgument.create(654);
        }, "should raise exception on invalid arguments");

        var cliArgument = $cliTools.CliArgument.create();

        ok(cliArgument.hasOwnProperty('argumentName'), "should add argumentName property");
        equal(typeof cliArgument.argumentName, 'undefined', "should set argumentName to undefined");
        ok(cliArgument.hasOwnProperty('argumentValue'), "should add argumentValue property");
        equal(typeof cliArgument.argumentValue, 'undefined', "should set argumentValue to undefined");
    });

    test("Conversion from string", function () {
        var cliArgument = 'foo'.toCliArgument();

        ok(cliArgument.isA($cliTools.CliArgument), "should return CliArgument instance");
    });

    test("Argument name setter", function () {
        var cliArgument = $cliTools.CliArgument.create();

        strictEqual(cliArgument.setArgumentName('foo'), cliArgument, "should be chainable");
        equal(cliArgument.argumentName, 'foo', "should set argumentName property");
    });

    test("Argument value setter", function () {
        var cliArgument = $cliTools.CliArgument.create();

        strictEqual(cliArgument.setArgumentValue('bar'), cliArgument, "should be chainable");
        equal(cliArgument.argumentValue, 'bar', "should set argumentValue property");
    });
}());
