(function () {
    "use strict";

    module("CliOption");

    test("Instantiation", function () {
        var cliArgument = $cliTools.CliOption.create('--foo=bar');

        equal(cliArgument.argumentName, 'foo', "should set argumentName");
        equal(cliArgument.argumentValue, 'bar', "should set argumentValue");
    });

    test("CliArgument surrogate", function () {
        var cliArgument = $cliTools.CliArgument.create('--foo=bar');

        ok(cliArgument.isA($cliTools.CliOption), "should return CliOption instance");
        equal(cliArgument.argumentName, 'foo', "should set argumentName");
        equal(cliArgument.argumentValue, 'bar', "should set argumentValue");
    });

    test("Serialization", function () {
        equal('--foo=bar'.toCliArgument().toString(), '--foo=bar',
            "should return option assignment for option");
    });
}());
