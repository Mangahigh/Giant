$oop.postpone($asset2, 'ManifestAsset', function () {
    "use strict";

    var base = $asset2.Asset,
        self = base.extend();

    /**
     * @function $asset2.ManifestAsset.create
     * @returns {$asset2.ManifestAsset}
     */

    /**
     * Represents a JSON file containing a manifest as an asset.
     * @class $asset2.ManifestAsset
     * @extends $asset2.Asset
     */
    $asset2.ManifestAsset = self
        .addPrivateMethods(/** @lends $asset2.ManifestAsset# */{
            /**
             * @param {string} fileName
             * @param {string|object} options
             * @returns {object}
             * @private
             */
            _readFileSyncProxy: function (fileName, options) {
                return require('fs').readFileSync(fileName, options);
            },

            /**
             * @param {string} fileName
             * @private
             */
            _readJson: function (fileName) {
                return JSON.parse(this._readFileSyncProxy(fileName, 'utf8'));
            }
        })
        .addMethods(/** @lends $asset2.ManifestAsset# */{
            /**
             * @param {string} fileName
             * @ignore
             */
            init: function (fileName) {
                var parsedFileName = $asset2.RE_ASSET_REFERENCE.exec(fileName);

                $assertion.assert($asset2.RE_ASSET_REFERENCE.test(fileName), "Invalid manifest file name");

                base.init.call(this, parsedFileName[1]);

                /**
                 * @type {string}
                 */
                this.targetName = parsedFileName[2];
            },

            /**
             * @param {string} targetName Name of target we're currently operating under.
             * @param {string} assetType Name of asset type we're currently operating under.
             * @returns {string[]}
             */
            resolveFileNames: function (targetName, assetType) {
                return this.toManifest()
                    .setBasePath(this.getDirName())
                    .getResolvedManifest()
                    .getFileNames(this.targetName || targetName || 'default', assetType);
            },

            /**
             * @returns {$asset2.Manifest}
             */
            toManifest: function () {
                return $asset2.Manifest.create(this._readJson(this.fileName));
            }
        });
});

$oop.amendPostponed($asset2, 'Asset', function () {
    "use strict";

    $asset2.Asset.addSurrogate($asset2, 'ManifestAsset', function (fileName) {
        return $asset2.RE_ASSET_REFERENCE.test(fileName);
    });
});

(function () {
    "use strict";

    $oop.addGlobalConstants.call($asset2, /** @lends $asset2 */{
        /**
         * Validates / parses a reference to a manifest JSON optionally filtered by target.
         * @constant
         */
        RE_ASSET_REFERENCE: /^(.*?\.json)(?::([^:]+))?$/
    });
}());
