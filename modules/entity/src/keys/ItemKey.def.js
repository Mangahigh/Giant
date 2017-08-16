$oop.postpone($entity, 'ItemKey', function () {
    "use strict";

    var base = $entity.FieldKey,
        self = base.extend();

    /**
     * Creates an ItemKey instance.
     * ItemKey instances may also be created via conversion from string or array.
     * @name $entity.ItemKey.create
     * @function
     * @param {string} documentType Identifies type of document the current item belongs to.
     * @param {string} documentId Identifies the document (within document type) the current item belongs to.
     * @param {string} fieldName Identifies field (within document) the current item belongs to.
     * @param {string} itemId Identifies item (within field).
     * @returns {$entity.ItemKey}
     */

    /**
     * The ItemKey class identifies item entity nodes in the cache.
     * `ItemKey` subclasses `FieldKey` so that any method that accepts `FieldKey` as argument, would also accept
     * `ItemKey`. Whatever works with fields, should also work with collection items.
     * @class
     * @extends $entity.FieldKey
     */
    $entity.ItemKey = self
        .addMethods(/** @lends $entity.ItemKey# */{
            /**
             * @param {string} documentType
             * @param {string} documentId
             * @param {string} fieldName
             * @param {string} itemId
             * @ignore
             */
            init: function (documentType, documentId, fieldName, itemId) {
                base.init.call(this, documentType, documentId, fieldName);

                /**
                 * Identifies item in collection.
                 * @type {string}
                 */
                this.itemId = itemId;

                this.eventPath.appendKey(itemId);
            },

            /**
             * Tells whether specified `ItemKey` instance is equivalent to the current one.
             * @param {$entity.ItemKey} itemKey
             * @returns {boolean}
             */
            equals: function (itemKey) {
                return itemKey &&
                    $entity.FieldKey.equals.call(this, itemKey) &&
                    this.itemId === itemKey.itemId;
            },

            /**
             * Determines absolute path for the item identified by the current key.
             * In case the item entity node sits on a different path
             * relative to the field node for a certain `documentType` / `fieldName` combination,
             * subclass `ItemKey` and override `.getEntityPath()` to reflect the correct path.
             * @returns {$data.Path}
             */
            getEntityPath: function () {
                return base.getEntityPath.call(this)
                    .appendKey(String(this.itemId));
            },

            /**
             * Creates a field key that is parent of the item identified by the current key.
             * @returns {$entity.FieldKey}
             */
            getFieldKey: function () {
                var documentKey = this.documentKey;
                return [documentKey.documentType, documentKey.documentId, this.fieldName].toFieldKey();
            },

            /**
             * Serializes current item key.
             * @example
             * $entity.ItemKey.create('user', '1234', 'phones', 'work').toString() // "user/1234/phones/work"
             * @returns {string}
             */
            toString: function () {
                return $entity.FieldKey.toString.call(this) + '/' +
                    $utils.StringUtils.escapeChars(this.itemId, '/');
            }
        });
});

(function () {
    "use strict";

    $assertion.addTypes(/** @lends $entity */{
        /** @param {$entity.ItemKey} expr */
        isItemKey: function (expr) {
            return $entity.ItemKey.isBaseOf(expr);
        },

        /** @param {$entity.ItemKey} [expr] */
        isItemKeyOptional: function (expr) {
            return typeof expr === 'undefined' ||
                $entity.ItemKey.isBaseOf(expr);
        }
    });

    $oop.extendBuiltIn(String.prototype, /** @lends String# */{
        /**
         * Converts `String` to `ItemKey`. Assumes the string to be serialized `ItemKey`.
         * @returns {$entity.ItemKey}
         */
        toItemKey: function () {
            var StringUtils = $utils.StringUtils,
                parts = StringUtils.safeSplit(this, '/'),
                documentType = parts[0],
                documentId = parts[1],
                fieldName = parts[2],
                itemId = parts[3];

            return typeof documentType === 'string' &&
                typeof documentId === 'string' &&
                typeof fieldName === 'string' &&
                typeof itemId === 'string' ?
                $entity.ItemKey.create(
                    StringUtils.unescapeChars(documentType, '/'),
                    StringUtils.unescapeChars(documentId, '/'),
                    StringUtils.unescapeChars(fieldName, '/'),
                    StringUtils.unescapeChars(itemId, '/')) :
                undefined;
        }
    });

    $oop.extendBuiltIn(Array.prototype, /** @lends Array# */{
        /**
         * Converts `Array` (of strings) to `ItemKey`. Assumes the array is an item key in array notation.
         * @returns {$entity.ItemKey}
         */
        toItemKey: function () {
            var documentType = this[0],
                documentId = this[1],
                fieldName = this[2],
                itemId = this[3];

            return typeof documentType !== 'undefined' &&
                typeof documentId !== 'undefined' &&
                typeof fieldName !== 'undefined' &&
                typeof itemId !== 'undefined' ?
                $entity.ItemKey.create(documentType, documentId, fieldName, itemId) :
                undefined;
        }
    });
}());
