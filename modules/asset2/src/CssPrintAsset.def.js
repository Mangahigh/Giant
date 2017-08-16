$oop.postpone($asset2, 'CssPrintAsset', function () {
    "use strict";

    var base = $asset2.Asset,
        self = base.extend();

    /**
     * @function $asset2.CssPrintAsset.create
     * @returns {$asset2.CssPrintAsset}
     */

    /**
     * @class $asset2.CssPrintAsset
     * @extends $asset2.Asset
     */
    $asset2.CssPrintAsset = self
        .addMethods(/** @lends $asset2.CssPrintAsset# */{
            /** @returns {string} */
            getHtmlTag: function () {
                return '<link rel="stylesheet" href="' + this.fileName + '" media="print" />';
            }
        });
});

$oop.amendPostponed($asset2, 'Asset', function () {
    "use strict";

    $asset2.Asset.addSurrogate($asset2, 'CssPrintAsset', function (fileName) {
        return fileName && fileName.match('print[0-9]*\.css');
    });
});
