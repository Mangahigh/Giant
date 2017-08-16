$oop.postpone($entity, 'DocumentKey', function () {
    "use strict";

    var base = $entity.EntityKey,
        self = base.extend();

    /**
     * Creates a DocumentKey instance.
     * DocumentKey instances may also be created via conversion from string or array.
     * @name $entity.DocumentKey.create
     * @function
     * @param {string} documentType Identifies document type.
     * @param {string} documentId Identifies document in the context of its document type.
     * @returns {$entity.DocumentKey}
     */

    /**
     * The DocumentKey class identifies document nodes in the cache.
     * @class
     * @extends $entity.EntityKey
     */
    $entity.DocumentKey = self
        .setEventPath(['document'].toPath().prepend(base.eventPath))
        .addMethods(/** @lends $entity.DocumentKey# */{
            /**
             * @param {string} documentType
             * @param {string} documentId
             * @ignore
             */
            init: function (documentType, documentId) {
                base.init.call(this);

                /**
                 * Document type.
                 * @type {string}
                 */
                this.documentType = documentType;

                /**
                 * Document identifier.
                 * @type {string}
                 */
                this.documentId = documentId;

                this.setEventPath([documentType, documentId].toPath().prepend(this.eventPath));
            },

            /**
             * Tells whether the specified `DocumentKey` instance is equivalent to the current one.
             * @param {$entity.DocumentKey} documentKey
             * @returns {boolean}
             */
            equals: function (documentKey) {
                return documentKey &&
                    this.documentType === documentKey.documentType &&
                    this.documentId === documentKey.documentId;
            },

            /**
             * Fetches a document key to the
             * @returns {$entity.DocumentKey}
             */
            getConfigKey: function () {
                return ['document', this.documentType].toDocumentKey();
            },

            /**
             * Determines absolute path to the entity node of the document identified by the current key.
             * In case document node sits on a different path for a certain `documentType`,
             * subclass `DocumentKey` and override `.getEntityPath()` to reflect the correct path.
             * @returns {$data.Path}
             */
            getEntityPath: function () {
                return ['document', String(this.documentType), String(this.documentId)].toPath();
            },

            /**
             * Creates a `FieldKey` instance based on the current document key and the specified field name.
             * @param {string} fieldName
             * @returns {$entity.FieldKey}
             */
            getFieldKey: function (fieldName) {
                return $entity.FieldKey.create(
                    this.documentType,
                    this.documentId,
                    fieldName
                );
            },

            /**
             * Serializes current document key.
             * @example
             * $entity.DocumentKey.create('user', '1234').toString() // "user/1234"
             * @returns {string}
             */
            toString: function () {
                var StringUtils = $utils.StringUtils;
                return StringUtils.escapeChars(this.documentType, '/') + '/' +
                    StringUtils.escapeChars(this.documentId, '/');
            }
        });
});

(function () {
    "use strict";

    $assertion.addTypes(/** @lends $entity */{
        /** @param {$entity.DocumentKey} expr */
        isDocumentKey: function (expr) {
            return $entity.DocumentKey.isBaseOf(expr);
        },

        /** @param {$entity.DocumentKey} [expr] */
        isDocumentKeyOptional: function (expr) {
            return typeof expr === 'undefined' ||
                $entity.DocumentKey.isBaseOf(expr);
        }
    });

    $oop.extendBuiltIn(String.prototype, /** @lends String# */{
        /**
         * Converts `String` to a `DocumentKey` instance. Assumes string is a serialized document key.
         * @returns {$entity.DocumentKey}
         */
        toDocumentKey: function () {
            var StringUtils = $utils.StringUtils,
                parts = StringUtils.safeSplit(this, '/'),
                documentType = parts[0],
                documentId = parts[1];

            return typeof documentType === 'string' && typeof documentId === 'string' ?
                $entity.DocumentKey.create(
                    StringUtils.unescapeChars(documentType, '/'),
                    StringUtils.unescapeChars(documentId, '/')) :
                undefined;
        }
    });

    $oop.extendBuiltIn(Array.prototype, /** @lends Array# */{
        /**
         * Converts `Array` (of strings) to a `DocumentKey` instance.
         * Assumes array is a document key in array notation.
         * @returns {$entity.DocumentKey}
         * @example
         * ['foo', 'bar'].toDocumentKey() // single document key
         */
        toDocumentKey: function () {
            var documentType = this[0],
                documentId = this[1];

            return typeof documentType !== 'undefined' && typeof documentId !== 'undefined' ?
                $entity.DocumentKey.create(documentType, documentId) :
                undefined;
        }
    });
}());
