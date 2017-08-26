(function () {
    "use strict";

    module("AssetCollection");

    test("Conversion from Hash", function () {
        var hash = $data.Hash.create([
                'foo.js'.toAsset2(),
                'bar.css'.toAsset2(),
                'baz.json'.toAsset2()
            ]),
            assetCollection = hash.toAssetCollection2();

        ok(assetCollection.isA($asset2.AssetCollection), "should return AssetCollection");
        strictEqual(assetCollection.items, hash.items, "should set items buffer");
    });

    test("HTML tag getter", function () {
        var assetCollection = $asset2.AssetCollection.create([
            'foo.js'.toAsset2(),
            'bar.css'.toAsset2(),
            'baz.json'.toAsset2()
        ]);

        equal(assetCollection.getHtmlTag(), [
                '<script src="foo.js"></script>',
                '<link rel="stylesheet" href="bar.css" media="all" />',
                undefined
            ].join('\n'),
            "should return concatenated HTML string");
    });
}());
