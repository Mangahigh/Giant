$oop.postpone($entity, 'CollectionField', function () {
    "use strict";

    var base = $entity.Field,
        self = base.extend();

    /**
     * Creates a CollectionField instance.
     * CollectionField instances may be created via `$entity.Field.create` provided that the `config` cache defines
     * the field type as 'collection'.
     * @name $entity.CollectionField.create
     * @function
     * @param {$entity.FieldKey} fieldKey Identifies collection field.
     * @returns {$entity.CollectionField}
     */

    /**
     * The CollectionField class implements an API for composite document fields, granting access to items.
     * @class
     * @extends $entity.Field
     */
    $entity.CollectionField = self
        .addMethods(/** @lends $entity.CollectionField# */{
            /**
             * Fetches node from cache containing the collection items.
             * @returns {object}
             */
            getItems: function () {
                return this.getValue();
            },

            /**
             * Fetches items node wrapped in a `Collection` instance.
             * @returns {$data.Collection}
             */
            getItemsAsCollection: function () {
                return $data.Collection.create(this.getValue());
            },

            /**
             * Retrieves `Item` entity matching the specified item ID.
             * @param {string} itemId
             * @returns {$entity.Item}
             */
            getItem: function (itemId) {
                return this.entityKey.getItemKey(itemId).toItem();
            },

            /**
             * Retrieves an item key for the item matching the specified value.
             * @param {*} value
             * @returns {$entity.ItemKey}
             */
            getItemKeyByValue: function (value) {
                var item = this.getItemByValue(value);
                return item && item.entityKey;
            },

            /**
             * Retrieves an Item instance for the item matching the specified value.
             * Iterates over all items. Avoid using it for large collections.
             * @param {*} value
             * @returns {$entity.Item}
             */
            getItemByValue: function (value) {
                var result,
                    itemsNode = this.getItems(),
                    itemIds,
                    i, item;

                if (itemsNode) {
                    itemIds = Object.keys(itemsNode);
                    for (i = 0; i < itemIds.length; i++) {
                        item = this.getItem(itemIds[i]);
                        if (item.getValue() === value) {
                            result = item;
                            break;
                        }
                    }
                }

                return result;
            },

            /**
             * Appends the specified item nodes to the current collection.
             * @param {object} itemsNode
             * @returns {$entity.CollectionField}
             */
            appendItems: function (itemsNode) {
                this.getValueEntity().appendNode(itemsNode);
                return this;
            }
        });
});

$oop.amendPostponed($entity, 'Field', function () {
    "use strict";

    $entity.Field
        .addSurrogate($entity, 'CollectionField', function (/**$entity.FieldKey*/fieldKey) {
            return fieldKey.getFieldType() === 'collection';
        });
});
