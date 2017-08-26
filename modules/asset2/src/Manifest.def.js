$oop.postpone($asset2, 'Manifest', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * Creates a Manifest instance.
     * @function $asset2.Manifest.create
     * @param {object} [manifestNode]
     * @returns {$asset2.Manifest}
     */

    /**
     * Manges a package manifest, which lists the assets that make up the package indexed by target and type.
     * @class $asset2.Manifest
     * @extends $oop.Base
     */
    $asset2.Manifest = self
        .addConstants(/** @lends $asset2.Manifest */{
            /**
             * @type {RegExp}
             * @constant
             */
            RE_FILE_COMPONENTS: /^(.*\/)?([^/]*?)(\.[^.]*)?$/
        })
        .addMethods(/** @lends $asset2.Manifest# */{
            /**
             * @param {object} [manifestNode] Structure: target > "assets" > assetType > #fileName
             * @ignore
             */
            init: function (manifestNode) {
                $assertion.isObjectOptional(manifestNode, "Invalid manifest node");

                /**
                 * Manifest data container.
                 * @type {object}
                 */
                this.manifestTree = $data.Tree.create(manifestNode);

                /**
                 * Relative path associated with the manifest.
                 * File names in the manifest will be treated as relative to this.
                 * @type {string}
                 */
                this.basePath = '';
            },

            /**
             * Sets the base path associated with the manifest.
             * @param {string} basePath
             * @returns {$asset2.Manifest}
             */
            setBasePath: function (basePath) {
                this.basePath = basePath;
                return this;
            },

            /**
             * Retrieves a list of file associated with the specified target and asset type.
             * @param {string} targetName
             * @param {string} assetType
             * @returns {string[]}
             */
            getFileNames: function (targetName, assetType) {
                $assertion
                    .isString(targetName, "Invalid target name")
                    .isString(assetType, "Invalid asset type");

                return this.manifestTree.getNode([targetName, 'assets', assetType].toPath()) || [];
            },

            /**
             * Retrieves a list of file associated with the specified target and asset type, wrapped in a Hash.
             * @param {string} targetName
             * @param {string} assetType
             * @returns {$data.Hash}
             */
            getFileNamesAsHash: function (targetName, assetType) {
                return $data.Hash.create(this.getFileNames(targetName, assetType));
            },

            /**
             * Retrieves a list of Asset instances associated with the specified target and asset type,
             * wrapped in a Hash.
             * @param {string} targetName
             * @param {string} assetType
             * @returns {$data.Collection}
             */
            getAssetsAsHash: function (targetName, assetType) {
                return this.getFileNamesAsHash(targetName, assetType)
                    .toCollection()
                    .createWithEachItem($asset2.Asset);
            },

            /**
             * Creates a Manifest instance in which all target / asset type combinations are reduced to a single file.
             * @returns {$asset2.Manifest}
             */
            getReducedManifest: function () {
                var result = $data.Tree.create();

                this.manifestTree
                    .queryPathsAsHash('|>assets>|'.toQuery())
                    .toCollection()
                    .forEachItem(function (assetsPath) {
                        var asArray = assetsPath.asArray,
                            targetName = asArray[0],
                            assetType = asArray[2];

                        result.setNode(assetsPath, [targetName + '.' + assetType]);
                    });

                return this.getBase().create(result.items);
            },

            /**
             * Creates a Manifest instance with all references to other manifest files resolved.
             * @returns {$asset2.Manifest}
             */
            getResolvedManifest: function () {
                // contains array positions for each reference asset in each target / asset type combination
                // these are the positions we'll replace with the resolved JSON's
                var that = this,
                    result = $data.Tree.create();

                // initializing array nodes
                this.manifestTree
                    .queryPathsAsHash('|>assets>|'.toQuery())
                    .toCollection()
                    .forEachItem(function (assetsPath) {
                        result.setNode(assetsPath, []);
                    });

                // collecting expanded asset file names from referenced manifests
                this.manifestTree
                    // obtaining flat list of assets
                    .queryPathValuePairsAsHash('|>assets>|>|'.toQuery())
                    .toCollection()
                    .callOnEachItem('toAsset2')

                    // resolving file names for each
                    .mapValues(function (/**$asset2.ManifestAsset*/asset, assetPathStr) {
                        var assetPath = assetPathStr.toPath(),
                            asArray = assetPath.asArray,
                            contextTargetName = asArray[0],
                            contextAssetType = asArray[2];

                        return asset.resolveFileNames(contextTargetName, contextAssetType);
                    })

                    // adding resolved file names to result
                    .forEachItem(function (resolvedFileNames, assetPathStr) {
                        var resolvedFileCount = resolvedFileNames.length,
                            assetPath = assetPathStr.toPath(),
                            assetsPath = assetPath.clone().trimRight(),
                            resolvedAssets = result.getNode(assetsPath),
                            i;

                        for (i = 0; i < resolvedFileCount; i++) {
                            resolvedAssets.push(that.basePath + resolvedFileNames[i]);
                        }
                    });

                return this.getBase().create(result.items);
            },

            /**
             * Creates a Manifest instance having the assets from the original manifest but with
             * flattened path structure. This is necessary to generate assets (esp. CSS) where path
             * references are identical to a production (packaged) distribution.
             * @returns {$asset2.Manifest}
             */
            getFlatManifest: function () {
                var result = $data.Tree.create(),
                    RE_FILE_COMPONENTS = self.RE_FILE_COMPONENTS,
                    manifestTree = this.manifestTree;

                // initializing result
                manifestTree
                    .queryPathsAsHash('|>assets>|'.toQuery())
                    .toCollection()
                    .forEachItem(function (assetsPath) {
                        result.setNode(assetsPath, []);
                    });

                // pairs asset file names with corresponding manifest paths
                var originalFileNameLookup = manifestTree.queryPathValuePairsAsHash('\\>"'.toQuery())
                        .toCollection()
                        .mapValues(function (fileName) {
                            var fileNameParts = fileName && fileName.match(RE_FILE_COMPONENTS);
                            return fileNameParts && (fileNameParts[2] + fileNameParts[3]);
                        }),

                // keeps track of how many of the same file name are in use throughout the manifest
                    fileNameCounters = originalFileNameLookup.toStringDictionary()
                        // counting occurrences of each asset file name
                        .reverse()
                        .toCollection()
                        .mapValues(function (paths) {
                            return paths instanceof Array && paths.length || 1;
                        });

                // pairing flattened asset names with corresponding manifest paths
                originalFileNameLookup.toCollection()
                    .forEachItem(function (fileName, pathStr) {
                        var i = fileNameCounters.getItem(fileName),
                            fileNameParts = fileName && fileName.match(RE_FILE_COMPONENTS);

                        // decreasinf counter for current file name (no path)
                        fileNameCounters.setItem(fileName, i - 1);

                        result.setNode(pathStr.toPath(), fileNameParts && (fileNameParts[2] + i + fileNameParts[3]));
                    });

                return this.getBase().create(result.items);
            }
        });
});

(function () {
    "use strict";

    $assertion.addTypes(/** @lends $assertion */{
        /**
         * @param {$asset2.Manifest} expr
         */
        isManifest: function (expr) {
            return $asset2.Manifest.isBaseOf(expr);
        },

        /**
         * @param {$asset2.Manifest} [expr]
         */
        isManifestOptional: function (expr) {
            return typeof expr === 'undefined' ||
                $asset2.Manifest.isBaseOf(expr);
        }
    });
}());
