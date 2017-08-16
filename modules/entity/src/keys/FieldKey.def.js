$oop.postpone($entity, 'FieldKey', function () {
    "use strict";

    var base = $entity.EntityKey,
        self = base.extend();

    /**
     * Creates FieldKey instance.
     * FieldKey instances may also be created via conversion from string or array.
     * @name $entity.FieldKey.create
     * @function
     * @param {string} documentType Identifies type of document the field belongs to.
     * @param {string} documentId Identifies document (within document type) the field belongs to.
     * @param {string} fieldName Identifies field (within document).
     * @returns {$entity.FieldKey}
     */

    /**
     * The FieldKey class identifies a field entity nodes in the cache.
     * @class
     * @extends $entity.EntityKey
     */
    $entity.FieldKey = self
        .setEventPath(['document'].toPath().prepend(base.eventPath))
        .addMethods(/** @lends $entity.FieldKey# */{
            /**
             * @param {string} documentType
             * @param {string} documentId
             * @param {string} fieldName
             * @ignore
             */
            init: function (documentType, documentId, fieldName) {
                base.init.call(this);

                /**
                 * Document key reference.
                 * @type {$entity.DocumentKey}
                 */
                this.documentKey = $entity.DocumentKey.create(documentType, documentId);

                /**
                 * Name of current field.
                 * @type {string}
                 */
                this.fieldName = fieldName;

                this.setEventPath([fieldName].toPath().prepend(this.documentKey.eventPath));
            },

            /**
             * Tells whether current field key is equivalent to the specified one.
             * @param {$entity.FieldKey} fieldKey
             * @returns {boolean}
             */
            equals: function (fieldKey) {
                return fieldKey &&
                    this.documentKey.equals(fieldKey.documentKey) &&
                    this.fieldName === fieldKey.fieldName;
            },

            /**
             * Fetches key to config document that describes the current field.
             * @returns {$entity.DocumentKey}
             */
            getConfigKey: function () {
                var documentId = [this.documentKey.documentType, this.fieldName].toDocumentKey().toString();
                return ['field', documentId].toDocumentKey();
            },

            /**
             * Creates an `ItemKey` instance based on the current field key and the specified item ID.
             * @param {string} itemId
             * @returns {$entity.ItemKey}
             */
            getItemKey: function (itemId) {
                var documentKey = this.documentKey;

                return $entity.ItemKey.create(
                    documentKey.documentType,
                    documentKey.documentId,
                    this.fieldName,
                    itemId
                );
            },

            /**
             * Determines absolute path to the field node identified by the current key.
             * In case field node sits on a different path relative to the document node
             * for a certain `documentType` / `fieldName` combination,
             * subclass `FieldKey` and override `.getEntityPath()` to reflect the correct path.
             * @returns {$data.Path}
             */
            getEntityPath: function () {
                return this.documentKey
                    .getEntityPath()
                    .appendKey(String(this.fieldName));
            },

            /**
             * Retrieves the field type associated with the current field from the config datastore.
             * @returns {string}
             * @see $entity.config
             */
            getFieldType: function () {
                var field = this.getConfigKey().getFieldKey('fieldType');
                return $entity.config.getNode(field.getEntityPath());
            },

            /**
             * Retrieves item type string for the item entity identified by the current key.
             * @returns {string}
             */
            getItemType: function () {
                var field = this.getConfigKey().getFieldKey('itemType');
                return $entity.config.getNode(field.getEntityPath());
            },

            /**
             * Retrieves item type string for the item entity identified by the current key.
             * @returns {string}
             */
            getItemIdType: function () {
                var field = this.getConfigKey().getFieldKey('itemIdType');
                return $entity.config.getNode(field.getEntityPath());
            },

            /**
             * Serializes current field key.
             * @example
             * $entity.FieldKey.create('user', '1234', 'name').toString() // "user/1234/name"
             * @returns {string}
             */
            toString: function () {
                return this.documentKey.toString() + '/' +
                    $utils.StringUtils.escapeChars(this.fieldName, '/');
            }
        });
});

(function () {
    "use strict";

    $assertion.addTypes(/** @lends $entity */{
        /** @param {$entity.FieldKey} expr */
        isFieldKey: function (expr) {
            return $entity.FieldKey.isBaseOf(expr);
        },

        /** @param {$entity.FieldKey} expr */
        isFieldKeyStrict: function (expr) {
            return $entity.FieldKey.isBaseOf(expr) &&
                expr.getBase() === $entity.FieldKey;
        },

        /** @param {$entity.FieldKey} [expr] */
        isFieldKeyOptional: function (expr) {
            return typeof expr === 'undefined' ||
                $entity.FieldKey.isBaseOf(expr);
        }
    });

    $oop.extendBuiltIn(String.prototype, /** @lends String# */{
        /**
         * Converts `String` to a `FieldKey`. Assumes that string is a serialized `FieldKey`.
         * @returns {$entity.FieldKey}
         */
        toFieldKey: function () {
            var StringUtils = $utils.StringUtils,
                parts = StringUtils.safeSplit(this, '/'),
                documentType = parts[0],
                documentId = parts[1],
                fieldName = parts[2];

            return typeof documentType === 'string' &&
                typeof documentId === 'string' &&
                typeof fieldName === 'string' ?
                $entity.FieldKey.create(
                    StringUtils.unescapeChars(documentType, '/'),
                    StringUtils.unescapeChars(documentId, '/'),
                    StringUtils.unescapeChars(fieldName, '/')) :
                undefined;
        }
    });

    $oop.extendBuiltIn(Array.prototype, /** @lends Array# */{
        /**
         * Converts `Array` (of strings) to a `FieldKey` instance.
         * Assumes that array is a field key in array notation.
         * @returns {$entity.FieldKey}
         */
        toFieldKey: function () {
            var documentType = this[0],
                documentId = this[1],
                fieldName = this[2];

            return typeof documentType !== 'undefined' &&
                typeof documentId !== 'undefined' &&
                typeof fieldName !== 'undefined' ?
                $entity.FieldKey.create(documentType, documentId, fieldName) :
                undefined;
        }
    });
}());
