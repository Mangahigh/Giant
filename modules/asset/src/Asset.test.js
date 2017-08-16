(function () {
    "use strict";

    module("Asset");

    test("Instantiation", function () {
        throws(function () {
            $asset.Asset.create();
        }, "should raise exception on absent arguments");

        var asset = $asset.Asset.create('foo/bar', 'baz');

        equal(asset.assetName, 'foo/bar', "should set asset name");
        equal(asset.assetType, 'baz', "should set asset type");
    });

    test("Conversion from string", function () {
        var asset = 'foo/bar'.toAsset('js');
        ok(asset.isA($asset.Asset), "should return Asset instance");
        equal(asset.assetName, 'foo/bar', "should set asset name");
        equal(asset.assetType, 'js', "should set asset type");
    });

    test("Prefixing", function () {
        var asset = 'foo/bar'.toAsset('js');

        strictEqual(asset.addPrefix('baz/'), asset, "should be chainable");
        equal(asset.assetName, 'baz/foo/bar', "should prefix asset name");
    });

    test("File name getter", function () {
        var asset = 'foo/bar.js'.toAsset('js');
        equal(asset.getAssetFileName(), 'bar.js', "should return file name part of path");
    });

    test("File base name getter", function () {
        var asset = 'foo/bar.js'.toAsset('js');
        equal(asset.getAssetBaseName(), 'bar', "should return file base name part of path");
    });

    test("File extension getter", function () {
        var asset = 'foo/bar.js'.toAsset('js');
        equal(asset.getAssetExtension(), 'js', "should return file extension part of path");
    });
}());
