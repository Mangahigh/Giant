(function () {
    "use strict";

    module("ManifestAsset");

    test("Instantiation", function () {
        throws(function () {
            $asset2.ManifestAsset.create('bar/foo.css');
        }, "should raise exception on non-JSON fileName arguments");

        throws(function () {
            $asset2.ManifestAsset.create(':hello');
        }, "should raise exception on on filter-only argument");
    });

    test("Asset surrogate", function () {
        var asset = 'bar/foo.json:hello'.toAsset2();

        ok(asset.isA($asset2.ManifestAsset), "should return ManifestAsset instance");
    });

    test("File name resolution", function () {
        var asset = 'bar/foo.json:hello'.toAsset2();

        asset.addMocks({
            _readFileSyncProxy: function () {
                return JSON.stringify({
                    hello: {
                        assets: {
                            js: [
                                'foo.js',
                                'bar.js'
                            ]
                        }
                    }
                });
            }
        });

        deepEqual(asset.resolveFileNames('hello', 'js'), [
            'bar/foo.js',
            'bar/bar.js'
        ], "should return array of resolved file names");
    });

    test("Manifest conversion", function () {
        var asset = 'bar/foo.json'.toAsset2(),
            manifestNode = {},
            manifest;

        $asset2.ManifestAsset.addMocks({
            _readFileSyncProxy: function () {
                return JSON.stringify(manifestNode);
            }
        });

        manifest = asset.toManifest();

        $asset2.ManifestAsset.removeMocks();

        ok(manifest.isA($asset2.Manifest), "should return Manifest instance");
        deepEqual(manifest.manifestTree.items, manifestNode, "should load manifest node");
    });
}());
