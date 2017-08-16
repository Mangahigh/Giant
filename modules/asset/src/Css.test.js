(function () {
    "use strict";

    module("Css");

    test("Instantiation", function () {
        var asset = $asset.Css.create('foo/bar');

        equal(asset.assetName, 'foo/bar', "should set asset name");
        equal(asset.assetType, 'css', "should set asset type to css");
    });

    test("Asset surrogate", function () {
        var asset = $asset.Asset.create('foo/bar', 'css');
        ok(asset.isA($asset.Css), "should return Css instance");
    });

    test("Serialization", function () {
        var asset = $asset.Css.create('foo/bar');
        equal(
            asset.toString(),
            '<link rel="stylesheet" href="foo/bar" />',
            "should return a link tag");
    });
}());
