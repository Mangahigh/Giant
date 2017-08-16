(function () {
    "use strict";

    module("CliExpectedArgument");

    test("Instantiation", function () {
        throws(function () {
            $cliTools.CliExpectedArgument.create();
        }, "should raise exception on missing arguments");

        throws(function () {
            $cliTools.CliExpectedArgument.create(654);
        }, "should raise exception on invalid arguments");

        var cliArgument = $cliTools.CliExpectedArgument.create('foo');

        equal(cliArgument.argumentName, 'foo', "should set argumentName property");
        ok(cliArgument.hasOwnProperty('argumentDescription'),
            "should add argumentDescription property");
        equal(typeof cliArgument.argumentDescription, 'undefined',
            "should set argumentDescription to undefined");
        ok(cliArgument.hasOwnProperty('defaultValue'),
            "should add defaultValue property");
        equal(typeof cliArgument.defaultValue, 'undefined',
            "should set defaultValue to undefined");
    });

    test("Conversion from string", function () {
        var cliArgument = 'foo'.toCliExpectedArgument();

        ok(cliArgument.isA($cliTools.CliExpectedArgument), "should return CliExpectedArgument instance");
        equal(cliArgument.argumentName, 'foo', "should set argumentName property");
    });

    test("Argument description setter", function () {
        var cliArgument = 'foo'.toCliExpectedArgument();

        strictEqual(cliArgument.setArgumentDescription('bar'), cliArgument, "should be chainable");
        equal(cliArgument.argumentDescription, 'bar', "should set argumentDescription property");
    });

    test("Default value setter", function () {
        var cliArgument = 'foo'.toCliExpectedArgument();

        strictEqual(cliArgument.setDefaultValue('bar'), cliArgument, "should be chainable");
        equal(cliArgument.defaultValue, 'bar', "should set defaultValue property");
    });

    test("Mandatory tester", function () {
        var cliArgument = 'foo'.toCliExpectedArgument();

        ok(cliArgument.isMandatory(), "should return true when defaultValue is undefined");

        cliArgument.setDefaultValue('bar');

        ok(!cliArgument.isMandatory(), "should return false when defaultValue is not undefined");
    });
}());
