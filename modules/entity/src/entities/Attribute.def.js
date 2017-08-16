$oop.postpone($entity, 'Attribute', function () {
    "use strict";

    var base = $entity.Entity,
        self = base.extend();

    /**
     * Creates a Attribute instance.
     * @name $entity.Attribute.create
     * @function
     * @param {$entity.AttributeKey} documentKey Identifies document.
     * @returns {$entity.Attribute}
     */

    /**
     * The Attribute class implements an API for attribute nodes.
     * Attribute nodes hold custom information about the entity they are associated with.
     * @class
     * @extends $entity.Entity
     */
    $entity.Attribute = self
        .addMethods(/** @lends $entity.Attribute# */{
            /**
             * @param {$entity.AttributeKey} attributeKey
             * @ignore
             */
            init: function (attributeKey) {
                $assertion.isAttributeKey(attributeKey, "Invalid attribute key");
                base.init.call(this, attributeKey);

                /**
                 * Attribute key associated with current entity.
                 * @name $entity.Attribute#entityKey
                 * @type {$entity.AttributeKey}
                 */
            },

            /**
             * Fetches entity the current attribute belongs to.
             * @returns {$entity.Entity}
             */
            getParentEntity: function () {
                return this.entityKey.parentKey.toEntity();
            }
        });
});

$oop.amendPostponed($entity, 'Entity', function () {
    "use strict";

    $entity.Entity
        .addSurrogate($entity, 'Attribute', function (entityKey) {
            return $entity.AttributeKey.isBaseOf(entityKey);
        });
});

$oop.amendPostponed($entity, 'AttributeKey', function () {
    "use strict";

    $entity.AttributeKey
        .addMethods(/** @lends $entity.AttributeKey */{
            /**
             * Converts `AttributeKey` to `Attribute`.
             * @returns {$entity.Attribute}
             */
            toAttribute: function () {
                return $entity.Attribute.create(this);
            }
        });
});
