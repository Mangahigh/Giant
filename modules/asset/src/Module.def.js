$oop.postpone($asset, 'Module', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * Creates a Module instance.
     * Module instances may also be created via conversion from string. The string in this case is
     * interpreted as the name of the module.
     * @name $asset.Module.create
     * @function
     * @param {string} moduleName
     * @param {object} moduleNode
     * @returns {$asset.Module}
     * @see String#toModule
     */

    /**
     * The Module class represents the assets that make up a single module of the application.
     * A Module may also point to a symbol through which the application can use it.
     * (Eg. a page class that needs to be instantiated before opening that page, assuming that
     * modules correspond to pages.)
     * @class
     * @extends $oop.Base
     */
    $asset.Module = self
        .addMethods(/** @lends $asset.Module# */{
            /**
             * @param {string} moduleName
             * @param {object} moduleNode
             * @ignore
             */
            init: function (moduleName, moduleNode) {
                $assertion
                    .isString(moduleName, "Invalid module name")
                    .isObject(moduleNode, "Invalid module node");

                /** @type {$data.Tree} */
                var moduleDescriptor = $data.Tree.create(moduleNode),
                    classPath = moduleDescriptor.getNode('classPath'.toPath());

                /**
                 * Name of the module. The module name must be unique within the application.
                 * @type {string}
                 */
                this.moduleName = moduleName;

                /**
                 * Class path associated with the module. The class path identifies the module's
                 * main symbol (object, function, class, etc.) relative to the global object.
                 * @type {$data.Path}
                 */
                this.classPath = classPath ?
                    classPath.toPathFromClassPath() :
                    undefined;

                /**
                 * Collection of asset collections. Within a module, there's an asset collection associated
                 * with each available asset type.
                 * @type {$data.Collection}
                 */
                this.assetCollections = moduleDescriptor
                    .getNodeAsHash('assets'.toPath())
                    .toCollection()
                    .mapValues(function (/**Array*/assets, assetType) {
                        return assets.toAssetCollection(assetType);
                    });
            },

            /**
             * Fetches all assets in the module for the specified asset type.
             * @param {string} assetType
             * @returns {$asset.AssetCollection}
             */
            getAssets: function (assetType) {
                $assertion.isString(assetType, "Invalid asset type");
                return this.assetCollections.getItem(assetType);
            },

            /**
             * Retrieves an array of asset names based on the contents of the module.
             * @param {string} assetType
             * @returns {string[]}
             */
            getAssetNames: function (assetType) {
                $assertion.isString(assetType, "Invalid asset type");
                var assets = this.assetCollections.getItem(assetType);
                return assets ?
                    assets.getAssetNames() :
                    [];
            },

            /**
             * Reconstructs module node base don current module contents.
             * @returns {object}
             */
            getModuleNode: function () {
                var result = {};

                if (this.classPath) {
                    result.classPath = this.classPath.toClassPath();
                }

                if (this.assetCollections.getKeyCount()) {
                    result.assets = this.assetCollections
                        .mapValues(function (assetCollection) {
                            return assetCollection.getAssetNames();
                        })
                        .items;
                }

                return result;
            },

            /**
             * Converts module to a single asset.
             * To be used for reducing all assets within the module to a single file ie.
             * via concatenation, minification, etc.
             * @example
             * 'foo'.toModule({hello: 'world'}).toAsset() // 'foo.js'.toAsset('js')
             * @param {string} assetType
             * @returns {$asset.Asset}
             */
            toAsset: function (assetType) {
                $assertion
                    .isString(assetType, "Invalid asset type")
                    .assert(this.assetCollections.getItem(assetType), "Invalid assetType");
                return (this.moduleName + '.' + assetType).toAsset(assetType);
            }
        });
});

(function () {
    "use strict";

    $oop.extendBuiltIn(String.prototype, /** @lends String# */{
        /**
         * @param {object} [moduleNode]
         * @returns {$asset.Module}
         */
        toModule: function (moduleNode) {
            return $asset.Module.create(this.valueOf(), moduleNode);
        }
    });
}());
