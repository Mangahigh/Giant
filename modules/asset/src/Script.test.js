(function () {
    "use strict";

    module("Script");

    test("Instantiation", function () {
        var asset = $asset.Script.create('foo/bar');

        equal(asset.assetName, 'foo/bar', "should set asset name");
        equal(asset.assetType, 'js', "should set asset type to js");
    });

    test("Asset surrogate", function () {
        var asset = $asset.Asset.create('foo/bar', 'js');
        ok(asset.isA($asset.Script), "should return Script instance");
    });

    test("Serialization", function () {
        var asset = $asset.Script.create('foo/bar');
        equal(
            asset.toString(),
            '<script src="foo/bar"></script>',
            "should return a script tag");
    });
}());
