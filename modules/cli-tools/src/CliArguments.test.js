(function () {
    "use strict";

    module("CliArguments");

    test("Instantiation with argv", function () {
        var args = $cliTools.CliArguments.create(['foo', 'bar', '--baz=qux']);

        deepEqual(args.argumentLookup.items, {
            'foo': 'foo'.toCliArgument(),
            'bar': 'bar'.toCliArgument(),
            'baz': '--baz=qux'.toCliArgument()
        }, "should set parsed arguments");

        equal(typeof args.expectedArguments, 'undefined', "should add expectedArguments property");
    });

    test("Instantiation without argv", function () {
        var args = $cliTools.CliArguments.create();

        deepEqual(args.argumentLookup.items, {}, "should set options collection property");
    });

    test("Conversion from array", function () {
        var args = ['foo', 'bar', '--baz=qux'].toCliArguments();

        ok(args.isA($cliTools.CliArguments), "should return giant.CliArguments instance");
    });

    test("Expected arguments setter", function () {
        var args = ['foo', 'bar', '--baz=qux'].toCliArguments(),
            expectedArgs = $cliTools.CliExpectedArguments.create()
                .setDefaultValues({
                    'bar': 'hello'
                });

        strictEqual(args.setExpectedArguments(expectedArgs), args, "should be chainable");
        strictEqual(args.expectedArguments, expectedArgs,
            "should set expectedArguments property");
    });

    test("Argument addition", function () {
        var args = ['foo', 'bar', '--baz=qux'].toCliArguments(),
            arg = 'foo'.toCliArgument();

        strictEqual(args.appendArgument(arg), args, "should be chainable");
        strictEqual(args.argumentLookup.getItem('foo'), arg,
            "should set argument in collection");
        strictEqual(args.argumentChain.lastLink.previousLink.value, arg,
            "should push argument to chain");
    });

    test("Arguments addition", function () {
        var args = ['foo'].toCliArguments(),
            remoteArgs = ['bar', 'baz'].toCliArguments();

        strictEqual(args.appendArguments(remoteArgs), args, "should be chainable");
        deepEqual(args.argumentLookup.items, {
            foo: 'foo'.toCliArgument(),
            bar: 'bar'.toCliArgument(),
            baz: 'baz'.toCliArgument()
        }, "should set arguments in collection");
        deepEqual(args.argumentChain.getValues(), [
            'foo'.toCliArgument(),
            'bar'.toCliArgument(),
            'baz'.toCliArgument()
        ], "should push arguments to chain");
    });

    test("Argument count getter", function () {
        equal(['foo', 'bar', '--baz=qux'].toCliArguments().getArgumentCount(), 3,
            "should return number of arguments");
        equal($cliTools.CliArguments.create().getArgumentCount(), 0,
            "should return zero for empty argument list");
    });

    test("Argument value getter", function () {
        var args = ['foo', '--bar=', '--baz=', '--hello=world'].toCliArguments()
            .setExpectedArguments($cliTools.CliExpectedArguments.create()
                .setDefaultValues({
                    'bar': 'hello'
                }));

        equal(args.getArgumentValue('hello'), 'world', "should return specified arguments");
        equal(args.getArgumentValue('foo'), true, "should return true for flags");
        equal(args.getArgumentValue('bar'), 'hello',
            "should return default argument where specified");
        equal(typeof args.getArgumentValue('baz'), 'undefined',
            "should return undefined where no value nor default is given");
    });

    test("Array getter", function () {
        var args = ['--foo=bar', '--baz=qux', 'hello'].toCliArguments();

        deepEqual(args.getAsArray(), ['--foo=bar', '--baz=qux', 'hello'],
            "should return arguments array");
    });

    test("Serialization", function () {
        var args = ['--foo=bar', '--baz=qux', 'hello'].toCliArguments();

        clearInterval(args.toString());
        equal(args.toString(), '--foo=bar --baz=qux hello', "should re-assemble options");
    });
}());
