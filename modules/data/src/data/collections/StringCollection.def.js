$oop.postpone($data, 'StringCollection', function () {
    "use strict";

    /**
     * @name $data.StringCollection.create
     * @function
     * @param {object} [items] Initial contents.
     * @returns {$data.StringCollection}
     */

    /**
     * General collection for managing multiple strings.
     * @class $data.StringCollection
     * @extends $data.Collection
     * @extends String
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
     */
    $data.StringCollection = $data.Collection.of(String);
});

$oop.amendPostponed($data, 'Hash', function () {
    "use strict";

    $data.Hash.addMethods(/** @lends $data.Hash# */{
        /**
         * Reinterprets hash as string collection.
         * @returns {$data.StringCollection}
         */
        toStringCollection: function () {
            return $data.StringCollection.create(this.items);
        }
    });
});

(function () {
    "use strict";

    $oop.extendBuiltIn(Array.prototype, /** @lends Array# */{
        /**
         * Creates a new StringCollection instance based on the current array.
         * @returns {$data.StringCollection}
         */
        toStringCollection: function () {
            return $data.StringCollection.create(this);
        }
    });
}());
