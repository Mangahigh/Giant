(function () {
    "use strict";

    module("CliApplication");

    test("Instantiation", function () {
        throws(function () {
            $cliTools.CliApplication.create();
        }, "should raise exception on missing arguments");

        var app = $cliTools.CliApplication.create('foo');

        console.log(app.applicationPath);

        equal(app.applicationPath, 'foo', "should set applicationPath property");
        equal(app.stdout, undefined, "should add stdout property");
        equal(app.stderr, undefined, "should add stderr property");
        equal(app.lastError, undefined, "should add lastError property");
    });

    test("Conversion from string", function () {
        var app = 'foo'.toCliApplication();

        ok(app.isA($cliTools.CliApplication), "should return CliApplication instance");
        equal(app.applicationPath, 'foo', "should set applicationPath property");
    });

    test("CliApplication runner", function () {
        expect(8);

        var app = 'foo'.toCliApplication(),
            process = {},
            processOptions = {},
            exit;

        app.addMocks({
            _spawnProxy: function (command, args, options) {
                equal(command, 'foo', "should pass node as command");
                deepEqual(args, ['--hello=world'], "should pass CLI arguments");
                strictEqual(options, processOptions, "should pass options");
                return process;
            },

            _processOnProxy: function (_process, eventName, handler) {
                // will be hit 2x
                strictEqual(_process, process, "should subscribe on spawned process");
                if (eventName === 'exit') {
                    exit = handler;
                }
            }
        });

        app.runCli(['--hello=world'].toCliArguments(), processOptions)
            .then(function () {
                equal(app.stdout, 'O', "should set stdout property");
                equal(app.stderr, 'E', "should set stderr property");
                equal(app.lastError, 'err', "should set lastError property");
            });

        exit('err', 'O', 'E');
    });

    test("CliApplication variations runner", function () {
        expect(1);

        var app = 'foo'.toCliApplication(),
            cliArgVariations = [
                ['--foo=bar'].toCliArguments(),
                ['--hello=world'].toCliArguments()
            ],
            runScriptParams = [];

        app.addMocks({
            runCli: function (cliArguments) {
                runScriptParams.push(cliArguments.toString());
                var deferred = $utils.Deferred.create();
                deferred.resolve();
                return deferred.promise;
            }
        });

        app.runCliVariants(cliArgVariations)
            .then(function () {
                deepEqual(runScriptParams, [
                    '--foo=bar',
                    '--hello=world'
                ], "should run scripts for all argument variations");
            });
    });
}());
