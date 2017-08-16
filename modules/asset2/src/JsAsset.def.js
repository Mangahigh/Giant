$oop.postpone($asset2, 'JsAsset', function () {
    "use strict";

    var base = $asset2.Asset,
        self = base.extend();

    /**
     * @function $asset2.JsAsset.create
     * @returns {$asset2.JsAsset}
     */

    /**
     * @class $asset2.JsAsset
     * @extends $asset2.Asset
     */
    $asset2.JsAsset = self
        .addMethods(/** @lends $asset2.JsAsset# */{
            /** @returns {string} */
            getHtmlTag: function () {
                return '<script src="' + this.fileName + '"></script>';
            }
        });
});

$oop.amendPostponed($asset2, 'Asset', function () {
    "use strict";

    $asset2.Asset.addSurrogate($asset2, 'JsAsset', function (fileName) {
        return fileName && fileName.split('.').pop() === 'js';
    });
});
