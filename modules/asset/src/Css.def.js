$oop.postpone($asset, 'Css', function () {
    "use strict";

    var base = $asset.Asset,
        self = base.extend();

    /**
     * Creates a Css asset instance.
     * Css assets may also be created via conversion from string.
     * @example
     * var css = 'foo.css'.toAsset('css');
     * @name $asset.Css.create
     * @function
     * @param {string} assetPath
     * @returns {$asset.Css}
     */

    /**
     * The Css class represents a style sheet asset file.
     * @class
     * @extends $asset.Asset
     */
    $asset.Css = self
        .addMethods(/** @lends $asset.Css# */{
            /**
             * @param {string} assetPath
             * @ignore
             */
            init: function (assetPath) {
                base.init.call(this, assetPath, 'css');
            },

            /**
             * Generates a string based on the current CSS asset, for inclusion in HTML files.
             * @returns {string}
             */
            toString: function () {
                return '<link rel="stylesheet" href="' + this.assetName + '" />';
            }
        });
});

$oop.amendPostponed($asset, 'Asset', function () {
    "use strict";

    $asset.Asset
        .addSurrogate($asset, 'Css', function (assetPath, assetType) {
            return assetType === 'css';
        });
});
