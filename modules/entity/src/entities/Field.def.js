$oop.postpone($entity, 'Field', function () {
    "use strict";

    var base = $entity.Entity,
        self = base.extend();

    /**
     * Creates a Field instance.
     * @name $entity.Field.create
     * @function
     * @param {$entity.FieldKey} fieldKey
     * @returns {$entity.Field}
     */

    /**
     * The Field entity class implements an API for document field nodes in the cache. Allows access and modification
     * of the field's value and attributes.
     * @class
     * @extends $entity.Entity
     * @extends $utils.Stringifiable
     */
    $entity.Field = self
        .addMethods(/** @lends $entity.Field# */{
            /**
             * @param {$entity.FieldKey} fieldKey
             * @ignore
             */
            init: function (fieldKey) {
                $assertion.isFieldKey(fieldKey, "Invalid field key");

                base.init.call(this, fieldKey);

                /**
                 * Field key associated with current entity.
                 * @name $entity.Field#entityKey
                 * @type {$entity.FieldKey}
                 */
            },

            /**
             * Fetches fields entity from the document the current field belongs to.
             * @returns {$entity.Entity}
             */
            getParentEntity: function () {
                return this.entityKey.documentKey.toDocument()
                    .getFieldsEntity();
            },

            /**
             * Fetches entity associated with the field's value.
             * Returns self by default.
             * @returns {$entity.Entity}
             */
            getValueEntity: function () {
                return this;
            },

            /**
             * Fetches field value node from cache.
             * Identical to the node by default.
             * @returns {*}
             */
            getValue: function () {
                return this.getValueEntity().getNode();
            },

            /**
             * Fetches field value node from cache without triggering access events.
             * @returns {*}
             */
            getSilentValue: function () {
                return this.getValueEntity().getSilentNode();
            },

            /**
             * Sets field value node to the specified value.
             * @param {*} value
             * @returns {$entity.Field}
             */
            setValue: function (value) {
                this.getValueEntity().setNode(value);
                return this;
            },

            /**
             * Returns the stringified value of the field.
             * @returns {string}
             */
            toString: function () {
                return $utils.Stringifier.stringify(this.getValue());
            }
        });
});

$oop.amendPostponed($entity, 'Entity', function () {
    "use strict";

    $entity.Entity
        .addSurrogate($entity, 'Field', function (entityKey) {
            return entityKey.instanceOf($entity.FieldKey);
        });
});

$oop.amendPostponed($entity, 'FieldKey', function () {
    "use strict";

    $entity.FieldKey
        .addMethods(/** @lends $entity.FieldKey */{
            /**
             * Converts `FieldKey` to `Field`.
             * @returns {$entity.Field}
             */
            toField: function () {
                return $entity.Field.create(this);
            }
        });
});

(function () {
    "use strict";

    $oop.extendBuiltIn(String.prototype, /** @lends String# */{
        /**
         * Converts `String` to `Field` instance, assuming the string is a serialized `FieldKey`.
         * @returns {$entity.Field}
         */
        toField: function () {
            return $entity.Field.create(this.toFieldKey());
        }
    });

    $oop.extendBuiltIn(Array.prototype, /** @lends Array# */{
        /**
         * Converts `Array` to `Field` instance, assuming the array is a field key in array notation.
         * @returns {$entity.Field}
         */
        toField: function () {
            return $entity.Field.create(this.toFieldKey());
        }
    });
}());
