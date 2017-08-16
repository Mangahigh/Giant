$oop.postpone($entity, 'Document', function () {
    "use strict";

    var base = $entity.Entity,
        self = base.extend();

    /**
     * Creates a Document instance.
     * A `Document` instance may also be created via conversion from string, array, and `DocumentKey`.
     * @name $entity.Document.create
     * @function
     * @param {$entity.DocumentKey} documentKey Identifies document.
     * @returns {$entity.Document}
     */

    /**
     * The Document class implements an API for document nodes,
     * granting access to the document's fields and attributes.
     * @class
     * @extends $entity.Entity
     */
    $entity.Document = self
        .addMethods(/** @lends $entity.Document# */{
            /**
             * @param {$entity.DocumentKey} documentKey
             * @ignore
             */
            init: function (documentKey) {
                $assertion.isDocumentKey(documentKey, "Invalid document key");
                base.init.call(this, documentKey);

                /**
                 * Document key associated with current entity.
                 * @name $entity.Document#entityKey
                 * @type {$entity.DocumentKey}
                 */
            },

            /**
             * Fetches entity associated with the document's fields.
             * Returns self by default.
             * @returns {$entity.Document}
             */
            getFieldsEntity: function () {
                return this;
            },

            /**
             * Retrieves Field entity matching the specified field name.
             * @param {string} fieldName
             * @returns {$entity.Field}
             */
            getField: function (fieldName) {
                return this.entityKey.getFieldKey(fieldName).toField();
            }
        });
});

$oop.amendPostponed($entity, 'Entity', function () {
    "use strict";

    $entity.Entity
        .addSurrogate($entity, 'Document', function (entityKey) {
            return $entity.DocumentKey.isBaseOf(entityKey);
        });
});

$oop.amendPostponed($entity, 'DocumentKey', function () {
    "use strict";

    $entity.DocumentKey
        .addMethods(/** @lends $entity.DocumentKey */{
            /**
             * Converts `DocumentKey` to `Document`.
             * @returns {$entity.Document}
             */
            toDocument: function () {
                return $entity.Document.create(this);
            }
        });
});

(function () {
    "use strict";

    $oop.extendBuiltIn(String.prototype, /** @lends String# */{
        /**
         * Converts `String` to `Document` instance, assuming the string is a serialized `DocumentKey`.
         * @returns {$entity.Document}
         */
        toDocument: function () {
            return $entity.Document.create(this.toDocumentKey());
        }
    });

    $oop.extendBuiltIn(Array.prototype, /** @lends Array# */{
        /**
         * Converts `Array` to `Document` instance, assuming the array is a document key in array notation.
         * @returns {$entity.Document}
         */
        toDocument: function () {
            return $entity.Document.create(this.toDocumentKey());
        }
    });
}());
