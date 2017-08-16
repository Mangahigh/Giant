$oop.postpone($entity, 'AttributeKey', function () {
    "use strict";

    var base = $entity.EntityKey,
        self = base.extend();

    /**
     * @name $entity.AttributeKey.create
     * @function
     * @param {$entity.EntityKey} parentKey Identifies the entity the attribute belongs to.
     * @param {string} attributeName Identifies the attribute relative to the parent entity.
     * @returns {$entity.AttributeKey}
     */

    /**
     * @class
     * @extends $entity.EntityKey
     */
    $entity.AttributeKey = self
        .setEventPath(['document'].toPath().prepend(base.eventPath))
        .addMethods(/** @lends $entity.AttributeKey# */{
            /**
             * @param {$entity.EntityKey} parentKey
             * @param {string} attributeName
             * @ignore
             */
            init: function (parentKey, attributeName) {
                base.init.call(this);

                /**
                 * @type {$entity.EntityKey}
                 */
                this.parentKey = parentKey;

                /**
                 * @type {string}
                 */
                this.attributeName = attributeName;

                this.setEventPath([attributeName].toPath().prepend(parentKey.eventPath));
            },

            /**
             * Tells whether the specified `AttributeKey` instance is equivalent to the current one.
             * @param {$entity.AttributeKey} attributeKey
             * @returns {boolean}
             */
            equals: function (attributeKey) {
                return attributeKey &&
                    this.parentKey.equals(attributeKey.parentKey) &&
                    this.attributeName === attributeKey.attributeName;
            },

            /**
             * Resolves attribute key based on the parent key and attribute name.
             * @returns {$data.Path}
             */
            getEntityPath: function () {
                return this.parentKey.getEntityPath().appendKey(this.attributeName);
            }
        });
});

(function () {
    "use strict";

    $assertion.addTypes(/** @lends $entity */{
        /** @param {$entity.AttributeKey} expr */
        isAttributeKey: function (expr) {
            return $entity.AttributeKey.isBaseOf(expr);
        },

        /** @param {$entity.AttributeKey} [expr] */
        isAttributeKeyOptional: function (expr) {
            return typeof expr === 'undefined' ||
                $entity.AttributeKey.isBaseOf(expr);
        }
    });
}());
