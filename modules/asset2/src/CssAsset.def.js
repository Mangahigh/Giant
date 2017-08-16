$oop.postpone($asset2, 'CssAsset', function () {
    "use strict";

    var base = $asset2.Asset,
        self = base.extend();

    /**
     * @function $asset2.CssAsset.create
     * @returns {$asset2.CssAsset}
     */

    /**
     * @class $asset2.CssAsset
     * @extends $asset2.Asset
     */
    $asset2.CssAsset = self
        .addMethods(/** @lends $asset2.CssAsset# */{
            /** @returns {string} */
            getHtmlTag: function () {
                return '<link rel="stylesheet" href="' + this.fileName + '" media="all" />';
            }
        });
});

$oop.amendPostponed($asset2, 'Asset', function () {
    "use strict";

    $asset2.Asset.addSurrogate($asset2, 'CssAsset', function (fileName) {
        return fileName && fileName.split('.').pop() === 'css' && !fileName.match('print[0-9]*\.css');
    });
});
