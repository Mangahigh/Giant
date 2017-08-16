$oop.postpone($data, 'Set', function () {
    "use strict";

    var base = $data.Hash,
        self = base.extend(),
        hOP = Object.prototype.hasOwnProperty;

    /**
     * Instantiates class.
     * @name $data.Set.create
     * @function
     * @param {object} items
     * @returns {$data.Set}
     */

    /**
     * Hash-based structure for performing standard set operations such as union, intersection, and difference.
     * @class
     * @extends $data.Hash
     */
    $data.Set = self
        .addMethods(/** @lends $data.Set# */{
            /**
             * Retrieves intersection of two sets.
             * @param {$data.Set} remoteSet
             * @returns {$data.Set} New set instance with items present in both current and remote set.
             */
            intersectWith: function (remoteSet) {
                $assertion.isSet(remoteSet, "Invalid set");

                var currentItems = this.items,
                    remoteItems = remoteSet.items,
                    resultItems = currentItems instanceof Array ? [] : {},
                    itemKey;

                for (itemKey in currentItems) {
                    if (hOP.call(currentItems, itemKey) &&
                        hOP.call(remoteItems, itemKey)) {
                        resultItems[itemKey] = currentItems[itemKey];
                    }
                }

                return this.getBase().create(resultItems);
            },

            /**
             * Extracts symmetric difference of two sets.
             * @param {$data.Set} remoteSet
             * @returns {$data.Set} New set instance with elements only present in either current or remote set.
             */
            differenceWith: function (remoteSet) {
                return this
                    .unionWith(remoteSet)
                    .subtract(this.intersectWith(remoteSet));
            },

            /**
             * Unites two sets.
             * @param {$data.Set} remoteSet
             * @returns {$data.Set} New set instance with items from both current and remote sets.
             */
            unionWith: function (remoteSet) {
                $assertion.isSet(remoteSet, "Invalid set");

                var resultItems = $data.DataUtils.shallowCopy(this.items),
                    currentItems = this.items,
                    remoteItems = remoteSet.items,
                    itemKey;

                for (itemKey in remoteItems) {
                    if (hOP.call(remoteItems, itemKey) && !hOP.call(currentItems, itemKey)) {
                        resultItems[itemKey] = remoteItems[itemKey];
                    }
                }

                return this.getBase().create(resultItems);
            },

            /**
             * Retrieves relative complement of two sets (A\B).
             * @param {$data.Set} remoteSet
             * @returns {$data.Set} New set instance with items from current instance except what's also present in
             * remote set.
             */
            subtract: function (remoteSet) {
                $assertion.isSet(remoteSet, "Invalid set");

                var currentItems = this.items,
                    remoteItems = remoteSet.items,
                    resultItems = currentItems instanceof Array ? [] : {},
                    itemKey;

                for (itemKey in currentItems) {
                    if (hOP.call(currentItems, itemKey) && !hOP.call(remoteItems, itemKey)) {
                        resultItems[itemKey] = currentItems[itemKey];
                    }
                }

                return this.getBase().create(resultItems);
            },

            /**
             * Retrieves relative complement of two sets (B\A).
             * @param {$data.Set} remoteSet
             * @returns {$data.Set} New set instance with items from remote instance except what's also present in
             * current set.
             */
            subtractFrom: function (remoteSet) {
                $assertion.isSet(remoteSet, "Invalid set");

                var currentItems = this.items,
                    remoteItems = remoteSet.items,
                    resultItems = currentItems instanceof Array ? [] : {},
                    itemKey;

                for (itemKey in remoteItems) {
                    if (hOP.call(remoteItems, itemKey) && !hOP.call(currentItems, itemKey)) {
                        resultItems[itemKey] = remoteItems[itemKey];
                    }
                }

                return this.getBase().create(resultItems);
            }
        });
});

$oop.amendPostponed($data, 'Hash', function () {
    "use strict";

    $data.Hash.addMethods(/** @lends $data.Hash# */{
        /**
         * Reinterprets hash as a string dictionary.
         * @returns {$data.Set}
         */
        toSet: function () {
            return $data.Set.create(this.items);
        }
    });
});

(function () {
    "use strict";

    $assertion.addTypes(/** @lends $data */{
        isSet: function (expr) {
            return $data.Set.isBaseOf(expr);
        },

        isSetOptional: function (expr) {
            return typeof expr === 'undefined' ||
                $data.Set.isBaseOf(expr);
        }
    });

    $oop.extendBuiltIn(Array.prototype, /** @lends Array# */{
        /**
         * Creates a new Set instance based on the current array.
         * @returns {$data.Set}
         */
        toSet: function () {
            return $data.Set.create(this);
        }
    });
}());
