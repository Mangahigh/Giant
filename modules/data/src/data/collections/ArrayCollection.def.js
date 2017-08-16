$oop.postpone($data, 'ArrayCollection', function () {
    "use strict";

    /**
     * @name $data.ArrayCollection.create
     * @function
     * @param {object} [items] Initial contents.
     * @returns {$data.ArrayCollection}
     */

    /**
     * General collection for managing multiple arrays.
     * @class $data.ArrayCollection
     * @extends $data.Collection
     * @extends Array
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
     */
    $data.ArrayCollection = $data.Collection.of(Array);
});

$oop.amendPostponed($data, 'Hash', function () {
    "use strict";

    $data.Hash.addMethods(/** @lends $data.Hash# */{
        /**
         * Reinterprets hash as array collection.
         * @returns {$data.ArrayCollection}
         */
        toArrayCollection: function () {
            return $data.ArrayCollection.create(this.items);
        }
    });
});

(function () {
    "use strict";

    $oop.extendBuiltIn(Array.prototype, /** @lends Array# */{
        /**
         * Creates a new ArrayCollection instance based on the current array.
         * @returns {$data.ArrayCollection}
         */
        toArrayCollection: function () {
            return $data.ArrayCollection.create(this);
        }
    });
}());
