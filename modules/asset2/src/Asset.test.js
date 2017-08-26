(function () {
    "use strict";

    module("Asset");

    test("Instantiation", function () {
        throws(function () {
            $asset2.Asset.create();
        }, "should raise exception on missing argument");

        throws(function () {
            $asset2.Asset.create(true);
        }, "should raise exception on invalid argument");

        var asset = $asset2.Asset.create('bar/foo.js');

        equal(asset.fileName, 'bar/foo.js', "should set fileName property");
    });

    test("Conversion from string", function () {
        var asset = 'bar/foo.js'.toAsset2();

        ok(asset.isA($asset2.Asset), "should return Asset instance");
        equal(asset.fileName, 'bar/foo.js', "should set fileName property");
    });

    test("Base name getter", function () {
        var asset = 'bar/foo.js'.toAsset2();

        equal(asset.getBaseName(), 'foo.js', "should return base file name");
    });

    test("Prepending file name", function () {
        var asset = 'foo.js'.toAsset2();

        strictEqual(asset.prependFileName('bar/'), asset, "should be chainable");
        equal(asset.fileName, 'bar/foo.js', "should prepend fileName property");
    });

    test("Directory name getter", function () {
        var asset = 'bar/foo.js'.toAsset2();

        equal(asset.getDirName(), 'bar/', "should return directory name");
    });

    test("File name resolution", function () {
        var asset = 'bar/foo.js'.toAsset2();

        deepEqual(asset.resolveFileNames(), ['bar/foo.js'],
            "should return singular array with asset file name in it.");
    });

    test("String conversion", function () {
        var asset = 'bar/foo.js'.toAsset2();
        equal(asset.toString(), 'bar/foo.js', "should return file name");
    });
}());
