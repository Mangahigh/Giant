(function () {
    "use strict";

    module("NodeScript");

    test("Instantiation", function () {
        throws(function () {
            $cliTools.NodeScript.create();
        }, "should raise exception on missing arguments");

        throws(function () {
            $cliTools.NodeScript.create('foo');
        }, "should raise exception on invalid arguments");

        var nodeScript = $cliTools.NodeScript.create('foo.js');

        equal(nodeScript.applicationPath, 'node', "should set node as applicationPath");
        equal(nodeScript.scriptPath, 'foo.js', "should set script path as scriptPath");
    });

    test("CliApplication surrogate", function () {
        var nodeScript = $cliTools.CliApplication.create('foo.js');
        ok(nodeScript.isA($cliTools.NodeScript), "should return NodeScript instance");
    });

    test("Running script", function () {
        expect(3);

        var script = $cliTools.NodeScript.create('foo.js'),
            processOptions = {},
            result = {};

        $cliTools.CliApplication.addMocks({
            runCli: function (cliArguments, _processOptions) {
                equal(cliArguments.toString(), 'foo.js bar baz', "should pass correct arguments");
                strictEqual(_processOptions, processOptions, "should pass correct process options");
                return result;
            }
        });

        strictEqual(script.runCli(['bar', 'baz'].toCliArguments(), processOptions), result,
            "should return whatever the super returns");

        $cliTools.CliApplication.removeMocks();
    });
}());
