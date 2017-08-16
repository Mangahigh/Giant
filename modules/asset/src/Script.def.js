$oop.postpone($asset, 'Script', function () {
    "use strict";

    var base = $asset.Asset,
        self = base.extend();

    /**
     * Creates a Script asset instance.
     * Script assets may also be created via conversion from string.
     * @example
     * var css = 'foo.js'.toAsset('js');
     * @name $asset.Script.create
     * @function
     * @param {string} assetPath
     * @returns {$asset.Script}
     */

    /**
     * The Script class represents a JavaScript asset file.
     * @class
     * @extends $asset.Asset
     */
    $asset.Script = self
        .addMethods(/** @lends $asset.Script# */{
            /**
             * @param {string} assetPath
             * @ignore
             */
            init: function (assetPath) {
                base.init.call(this, assetPath, 'js');
            },

            /**
             * Generates a string based on the current script asset, for inclusion in HTML files.
             * @returns {string}
             */
            toString: function () {
                return '<script src="' + this.assetName + '"></script>';
            }
        });
});

$oop.amendPostponed($asset, 'Asset', function () {
    "use strict";

    $asset.Asset
        .addSurrogate($asset, 'Script', function (assetPath, assetType) {
            return assetType === 'js';
        });
});
