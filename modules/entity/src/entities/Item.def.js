$oop.postpone($entity, 'Item', function () {
    "use strict";

    var base = $entity.Field,
        self = base.extend(),
        shallowCopy = $data.DataUtils.shallowCopy;

    /**
     * Creates an Item instance.
     * @name $entity.Item.create
     * @function
     * @param {$entity.ItemKey} itemKey
     * @returns {$entity.Item}
     */

    /**
     * The Item class implements an API for collection item nodes in the cache.
     * @class
     * @extends $entity.Field
     */
    $entity.Item = self
        .addMethods(/** @lends $entity.Item# */{
            /**
             * @param {$entity.ItemKey} itemKey
             * @ignore
             */
            init: function (itemKey) {
                $assertion.isItemKey(itemKey, "Invalid item key");

                base.init.call(this, itemKey);

                /**
                 * Item key associated with current entity.
                 * @name $entity.Item#entityKey
                 * @type {$entity.ItemKey}
                 */
            },

            /**
             * Fetches attribute entity that holds the items the current item belongs to.
             * @returns {$entity.Entity}
             */
            getParentEntity: function () {
                return this.entityKey.getFieldKey().toField()
                    .getValueEntity();
            },

            /**
             * Sets item in collection. When the item is already present, it just replaces the item node.
             * When it's not present yet, the item gets appended to the rest, triggering appropriate events.
             * TODO: Restore individual value setter when item path already exists.
             * @param {*} node Item node to be set in the collection.
             * @returns {$entity.Item}
             */
            setNode: function (node) {
                var that = this,
                    parentEntity = this.getParentEntity(),
                    parentKey = parentEntity.entityKey,
                    parentNodeBefore = shallowCopy(parentEntity.getSilentNode()),
                    nodeToAppend = {},
                    itemId = this.entityKey.itemId;

                nodeToAppend[itemId] = node;

                $entity.entities.appendNode(parentKey.getEntityPath(), nodeToAppend, function () {
                    var parentNodeAfter = parentEntity.getNode();

                    parentKey.spawnEvent($entity.EVENT_ENTITY_CHANGE)
                        .setBeforeNode(parentNodeBefore)
                        .setAfterNode(parentNodeAfter)
                        .setAffectedKey(that.entityKey)
                        .triggerSync();
                });

                return this;
            }
        });
});

$oop.amendPostponed($entity, 'Entity', function () {
    "use strict";

    $entity.Entity
        .addSurrogate($entity, 'Item', function (entityKey) {
            return entityKey.isA($entity.ItemKey);
        });
});

$oop.amendPostponed($entity, 'ItemKey', function () {
    "use strict";

    $entity.ItemKey
        .addMethods(/** @lends $entity.ItemKey */{
            /**
             * Creates Item instance based on the current item key.
             * @returns {$entity.Item}
             */
            toItem: function () {
                return $entity.Item.create(this);
            }
        });
});

(function () {
    "use strict";

    $oop.extendBuiltIn(String.prototype, /** @lends String# */{
        /**
         * Converts `String` to `Item` instance, assuming the string is a serialized `ItemKey`.
         * @returns {$entity.Item}
         */
        toItem: function () {
            return $entity.Item.create(this.toItemKey());
        }
    });

    $oop.extendBuiltIn(Array.prototype, /** @lends Array# */{
        /**
         * Converts `Array` to `Item` instance, assuming the array is an item key in array notation.
         * @returns {$entity.Item}
         */
        toItem: function () {
            return $entity.Item.create(this.toItemKey());
        }
    });
}());
