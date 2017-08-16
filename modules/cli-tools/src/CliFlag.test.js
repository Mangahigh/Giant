(function () {
    "use strict";

    module("CliOption");

    test("Instantiation", function () {
        var cliArgument = $cliTools.CliFlag.create('foo');

        equal(cliArgument.argumentName, 'foo', "should set argumentName");
        equal(cliArgument.argumentValue, true, "should set argumentValue");
    });

    test("CliArgument surrogate", function () {
        var cliArgument = $cliTools.CliArgument.create('foo');

        ok(cliArgument.isA($cliTools.CliFlag), "should return CliFlag instance");
        equal(cliArgument.argumentName, 'foo', "should set argumentName");
        equal(cliArgument.argumentValue, true, "should set argumentValue");
    });

    test("Serialization", function () {
        equal('foo'.toCliArgument().toString(), 'foo', "should return flag name");
    });
}());
