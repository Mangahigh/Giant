$oop.postpone($data, 'DateCollection', function () {
    "use strict";

    /**
     * @name $data.DateCollection.create
     * @function
     * @param {object} [items] Initial contents.
     * @returns {$data.DateCollection}
     */

    /**
     * General collection for managing multiple date objects.
     * @class $data.DateCollection
     * @extends $data.Collection
     * @extends Date
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
     */
    $data.DateCollection = $data.Collection.of(Date);
});

$oop.amendPostponed($data, 'Hash', function () {
    "use strict";

    $data.Hash.addMethods(/** @lends $data.Hash# */{
        /**
         * Reinterprets hash as date collection.
         * @returns {$data.DateCollection}
         */
        toDateCollection: function () {
            return $data.DateCollection.create(this.items);
        }
    });
});

(function () {
    "use strict";

    $oop.extendBuiltIn(Array.prototype, /** @lends Array# */{
        /**
         * Creates a new DateCollection instance based on the current array.
         * @returns {$data.DateCollection}
         */
        toDateCollection: function () {
            return $data.DateCollection.create(this);
        }
    });
}());
