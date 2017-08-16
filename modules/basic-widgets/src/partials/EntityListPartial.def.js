$oop.postpone($basicWidgets, 'EntityListPartial', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * Enables list-like widgets to bind their children composition to a collection field.
     * Keeps list in sync with the changes of the corresponding collection.
     * Trait expects to be added to List widgets that also have the EntityBound behavior.
     * Expects to be bound to a field of field type 'collection',
     * and item ID type 'reference'.
     * TODO: Add single item value change handler. (Depends on change in $entity.)
     * @class
     * @extends $oop.Base
     * @extends $entity.EntityBound
     * @extends $basicWidgets.List
     * @ignore
     */
    $basicWidgets.EntityListPartial = self
        .addPrivateMethods(/** @lends $basicWidgets.EntityListPartial# */{
            /** @private */
            _updateItemWidgets: function () {
                var that = this,
                    listKey = this.listKey,

                // identifying new and current item IDs
                    itemIdsInCache = listKey.toField()
                        .getItemsAsCollection()
                        .toSet(),
                    itemIdsInWidgets = this.itemIdToChildName.toSet(),

                // determining items to add & remove
                    itemKeysToRemove = itemIdsInWidgets.subtract(itemIdsInCache)
                        .toCollection()
                        .mapValues(function (value, itemId) {
                            return listKey.getItemKey(itemId);
                        }),
                    itemKeysToAdd = itemIdsInCache.subtract(itemIdsInWidgets)
                        .toCollection()
                        .mapValues(function (value, itemId) {
                            return listKey.getItemKey(itemId);
                        });

                // obtaining widgets based on
                var widgetsToRemove = itemKeysToRemove
                    .passEachItemTo(this.getItemWidgetByKey, this)
                    .filterByType($widget.Widget)
                    .toWidgetCollection(),
                    widgetsToAdd = itemKeysToAdd
                        .mapValues(function (itemKey) {
                            return that.spawnItemWidget(itemKey)
                                .setChildName(that.spawnItemName(itemKey));
                        })
                        .toWidgetCollection();

                // removing old widgets
                widgetsToRemove
                    .passEachItemTo(this.removeItemWidget, this);

                // adding new widgets
                widgetsToAdd
                    .passEachItemTo(this.addItemWidget, this);

                // updating item ID to child name lookup
                this.itemIdToChildName = itemIdsInCache.toCollection()
                    .mapValues(function (value, itemId) {
                        return listKey.getItemKey(itemId);
                    })
                    .passEachItemTo(this.spawnItemName);
            }
        })
        .addMethods(/** @lends $basicWidgets.EntityListPartial# */{
            /**
             * @param {$entity.FieldKey} fieldKey
             * @ignore
             */
            init: function (fieldKey) {
                $assertion
                    .isFieldKey(fieldKey, "Invalid field key")
                    .assert(fieldKey.toField().isA($entity.CollectionField), "Invalid field type");

                /**
                 * Identifies the collection to base elements on.
                 * @type {$entity.FieldKey}
                 */
                this.listKey = fieldKey;

                /**
                 * Lookup between item IDs and child names for item widgets.
                 * @type {$data.Collection}
                 */
                this.itemIdToChildName = $data.Collection.create();
            },

            /**
             * Call from host's afterAdd()
             */
            afterAdd: function () {
                this._updateItemWidgets();
                this.bindToEntityChange(this.listKey, 'onItemsChange');
            },

            /**
             * Call from host's afterRemove()
             */
            afterRemove: function () {
                this.unbindFromEntityChange(this.listKey, 'onItemsChange');
            },

            /**
             * Fetches item widget by item key.
             * @param {$entity.ItemKey} itemKey
             * @returns {$widget.Widget}
             */
            getItemWidgetByKey: function (itemKey) {
                var childName = this.itemIdToChildName.getItem(itemKey.itemId);
                return this.getChild(childName);
            },

            /**
             * Called when at least one collection item gets added or removed.
             * @ignore
             */
            onItemsChange: function () {
                this._updateItemWidgets();
            }
        });

    /**
     * Creates item widget for the specified item key.
     * To specify a custom widget class, override this method in the host.
     * @name $basicWidgets.EntityListPartial#spawnItemWidget
     * @function
     * @returns {$widget.Widget}
     */

    /**
     * Retrieves the item childName associated with the specified itemKey. (Child name determines order.)
     * To specify custom child name for item widgets, override this method.
     * TODO: Rename to 'spawnItemOrder' once giant-widget supports independent child ordering.
     * @name $basicWidgets.EntityListPartial#spawnItemName
     * @function
     * @returns {string}
     */
});
