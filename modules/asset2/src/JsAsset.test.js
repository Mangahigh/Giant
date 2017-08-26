(function () {
    "use strict";

    module("JsAsset");

    test("Asset surrogate", function () {
        var asset = 'bar/foo.js'.toAsset2();

        ok(asset.isA($asset2.JsAsset), "should return JsAsset instance");
    });

    test("HTML tag getter", function () {
        var asset = 'bar/foo.js'.toAsset2();

        equal(asset.getHtmlTag(), '<script src="bar/foo.js"></script>', "should return script tag");
    });
}());
