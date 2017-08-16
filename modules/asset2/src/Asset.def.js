$oop.postpone($asset2, 'Asset', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * Creates an Asset instance.
     * Assets may also be created by conversion from String.
     * @function $asset2.Asset.create
     * @param {string} fileName
     * @returns {$asset2.Asset}
     * @see String#toAsset2
     */

    /**
     * Represents an asset in the context of the application / package.
     * @class $asset2.Asset
     * @extends $oop.Base
     * @extends $utils.Stringifiable
     */
    $asset2.Asset = self
        .addMethods(/** @lends $asset2.Asset# */{
            /**
             * @param {string} fileName
             * @ignore
             */
            init: function (fileName) {
                $assertion.isString(fileName, "Invalid file name");

                /**
                 * File name (including ful path) associated with asset.
                 * @type {string}
                 */
                this.fileName = fileName;
            },

            /**
             * Extracts asset base name from file name.
             * @returns {string}
             */
            getBaseName: function () {
                return this.fileName.split('/').pop();
            },

            /**
             * Extracts asset directory from file name.
             * @returns {string}
             */
            getDirName: function () {
                var dirName = this.fileName.split('/').slice(0, -1).join('/');
                return dirName && dirName + '/';
            },

            /**
             * Prepends the specified string (eg. a path) to the file name asspciated with the asset.
             * @param {string} fileNamePrefix
             * @returns {$asset2.Asset}
             */
            prependFileName: function (fileNamePrefix) {
                this.fileName = fileNamePrefix + this.fileName;
                return this;
            },

            /**
             * @returns {string}
             */
            getHtmlTag: function () {
                return undefined;
            },

            /**
             * Retrieves a list of file names that the current asset resolves to.
             * By default it's the file name of the asset.
             * @returns {string[]}
             */
            resolveFileNames: function () {
                return [this.fileName];
            },

            /**
             * @returns {string}
             */
            toString: function () {
                return this.fileName;
            }
        });
});

(function () {
    "use strict";

    $oop.extendBuiltIn(String.prototype, /** @lends String# */{
        /**
         * TODO: Rename to 'toAsset' when replaceing giant-asset.
         * @returns {$asset.Asset}
         */
        toAsset2: function () {
            return $asset2.Asset.create(this.valueOf());
        }
    });
}());
