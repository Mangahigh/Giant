$oop.postpone($entity, 'ReferenceItemKey', function () {
    "use strict";

    var base = $entity.ItemKey,
        self = base.extend();

    /**
     * Creates ReferenceItemKey instance.
     * ReferenceItemKey instances may also be created via conversion from string or array,
     * as well as instantiating `ItemKey` with suitable arguments.
     * @name $entity.ReferenceItemKey.create
     * @function
     * @param {string} documentType Identifies type of document the current item belongs to.
     * @param {string} documentId Identifies the document (within document type) the current item belongs to.
     * @param {string} fieldName Identifies field (within document) the current item belongs to.
     * @param {string} ref Serialized `DocumentKey` identifying the referred document.
     * @returns {$entity.ReferenceItemKey}
     */

    /**
     * The ReferenceItemKey identifies an item node in the cache, the item ID of which is a document reference
     * (serialized `DocumentKey`).
     * @class
     * @extends $entity.ItemKey
     */
    $entity.ReferenceItemKey = self
        .addMethods(/** @lends $entity.ReferenceItemKey# */{
            /**
             * @param {string} documentType
             * @param {string} documentId
             * @param {string} fieldName
             * @param {string} ref
             * @ignore
             */
            init: function (documentType, documentId, fieldName, ref) {
                base.init.call(this, documentType, documentId, fieldName, ref);

                /**
                 * Key referenced by item ID.
                 * @type {$entity.DocumentKey}
                 */
                this.referenceKey = ref.toDocumentKey();
            }
        });
});

$oop.amendPostponed($entity, 'ItemKey', function () {
    "use strict";

    $entity.ItemKey
        .addSurrogate($entity, 'ReferenceItemKey', function (documentType, documentId, fieldName, itemId) {
            return itemId && itemId.toDocumentKey();
        });
});

(function () {
    "use strict";

    $assertion.addTypes(/** @lends $entity */{
        /** @param {$entity.ReferenceItemKey} expr */
        isReferenceItemKey: function (expr) {
            return $entity.ReferenceItemKey.isBaseOf(expr);
        },

        /** @param {$entity.ReferenceItemKey} [expr] */
        isReferenceItemKeyOptional: function (expr) {
            return typeof expr === 'undefined' ||
                $entity.ReferenceItemKey.isBaseOf(expr);
        }
    });

    $oop.extendBuiltIn(String.prototype, /** @lends String# */{
        /**
         * Converts `String` to a `ReferenceItemKey` instance. Assumes the string to be a serialized `ReferenceItemKey`.
         * @returns {$entity.ReferenceItemKey}
         */
        toReferenceItemKey: function () {
            var StringUtils = $utils.StringUtils,
                parts = StringUtils.safeSplit(this, '/'),
                documentType = parts[0],
                documentId = parts[1],
                fieldName = parts[2],
                itemId = parts[3],
                unescapedItemId;

            if (typeof documentType === 'string' &&
                typeof documentId === 'string' &&
                typeof fieldName === 'string' &&
                typeof itemId === 'string'
                ) {
                unescapedItemId = StringUtils.unescapeChars(itemId, '/');
            }

            return unescapedItemId && unescapedItemId.toDocumentKey() ?
                $entity.ReferenceItemKey.create(
                    StringUtils.unescapeChars(documentType, '/'),
                    StringUtils.unescapeChars(documentId, '/'),
                    StringUtils.unescapeChars(fieldName, '/'),
                    StringUtils.unescapeChars(itemId, '/')) :
                undefined;
        }
    });

    $oop.extendBuiltIn(Array.prototype, /** @lends Array# */{
        /**
         * Converts `Array` (of strings) to a `ReferenceItemKey` instance.
         * Assumes the array to be a reference item key in array notation.
         * @returns {$entity.ReferenceItemKey}
         */
        toReferenceItemKey: function () {
            var documentType = this[0],
                documentId = this[1],
                fieldName = this[2],
                itemId = this[3];

            return typeof documentType !== 'undefined' &&
                typeof documentId !== 'undefined' &&
                typeof fieldName !== 'undefined' &&
                typeof itemId !== 'undefined' &&
                itemId.toDocumentKey() ?
                $entity.ReferenceItemKey.create(documentType, documentId, fieldName, itemId) :
                undefined;
        }
    });
}());
