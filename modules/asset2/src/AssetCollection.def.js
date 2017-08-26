$oop.postpone($asset2, 'AssetCollection', function () {
    "use strict";

    var base = $data.Collection.of($asset2.Asset),
        self = base.extend();

    /**
     * @function $asset2.AssetCollection.create
     * @returns {$asset2.AssetCollection}
     */

    /**
     * @class $asset2.AssetCollection
     * @extends $oop.Base
     */
    $asset2.AssetCollection = self
        .addMethods(/** @lends $asset2.AssetCollection# */{
            /**
             * @returns {string}
             */
            getHtmlTag: function () {
                return this.callOnEachItem('getHtmlTag').items.join('\n');
            }
        });
});

$oop.amendPostponed($data, 'Hash', function () {
    "use strict";

    $data.Hash
        .addMethods(/** @lends $data.Hash# */{
            /**
             * Converts `Hash` instance with array items to `AssetCollection` instance.
             * @returns {$asset.AssetCollection}
             */
            toAssetCollection2: function () {
                return $asset2.AssetCollection.create(this.items);
            }
        });
});
