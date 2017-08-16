(function () {
    "use strict";

    module("CssAsset");

    test("Asset surrogate", function () {
        var asset = 'bar/foo.css'.toAsset2();

        ok(asset.isA($asset2.CssAsset), "should return CssAsset instance");
    });

    test("HTML tag getter", function () {
        var asset = 'bar/foo.css'.toAsset2();

        equal(asset.getHtmlTag(), '<link rel="stylesheet" href="bar/foo.css" media="all" />', "should return link tag");
    });
}());
