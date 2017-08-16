(function () {
    "use strict";

    module("CliExpectedArguments");

    test("Argument description setter", function () {
        var cliExpectedArguments = $cliTools.CliExpectedArguments.create();

        strictEqual(cliExpectedArguments.setArgumentDescriptions({
            foo: 'bar'
        }), cliExpectedArguments, "should be chainable");

        deepEqual(cliExpectedArguments.getKeys(), ['foo'], "should set initial arguments");

        cliExpectedArguments.setArgumentDescriptions({
            baz: 'qux'
        });

        deepEqual(cliExpectedArguments.getKeys(), ['foo', 'baz'], "should add new arguments");
    });

    test("Default values setter", function () {
        var cliExpectedArguments = $cliTools.CliExpectedArguments.create();

        strictEqual(cliExpectedArguments.setDefaultValues({
            foo: 'bar'
        }), cliExpectedArguments, "should be chainable");

        deepEqual(cliExpectedArguments.getKeys(), ['foo'], "should set initial arguments");

        cliExpectedArguments.setDefaultValues({
            baz: 'qux'
        });

        deepEqual(cliExpectedArguments.getKeys(), ['foo', 'baz'], "should add new arguments");
    });

    test("Help string getter", function () {
        var cliExpectedArguments = $cliTools.CliExpectedArguments.create()
            .setArgumentDescriptions({
                foo: 'bar',
                baz: 'qux'
            })
            .setDefaultValues({
                foo: "Hello World"
            });

        equal(
            cliExpectedArguments.getHelpString(),
            "Mandatory arguments:\n" +
                " baz : qux\n" +
                "\n" +
                "Optional arguments [default value]:\n" +
                " foo : bar [Hello World]\n",
            "should include mandatory and optional arguments with description and default");
    });
}());
