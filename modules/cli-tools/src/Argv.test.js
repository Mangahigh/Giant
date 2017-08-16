(function () {
    "use strict";

    module("Argv");

    test("Instantiation", function () {
        throws(function () {
            $cliTools.Argv.create(654);
        }, "should raise exception on invalid arguments");

        var argv = $cliTools.Argv.create(['foo', 'bar']);

        deepEqual(argv.argv, ['foo', 'bar'], "should set argv property");
    });

    test("Conversion from array", function () {
        var argv = ['foo', 'bar'].toArgv();

        ok(argv.isA($cliTools.Argv), "should return CliArgument instance");
        deepEqual(argv.argv, ['foo', 'bar'], "should set argv property");
    });

    test("Conversion to CliArguments", function () {
        var argv = ['foo', 'bar', 'baz'].toArgv(),
            result = argv.toCliArguments();

        ok(result.isA($cliTools.CliArguments), "should return CliArgument instance");
        deepEqual(result.argumentLookup.items, {
            baz: 'baz'.toCliArgument()
        }, "should exclude first 2 arguments");
    });
}());
