$oop.postpone($commonWidgets, 'DataListItem', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * The DataListItem trait associates widgets with an item key.
     * Any widget that to be used as an item in a DataList is expected to have tgis trait.
     * @class
     * @extends $oop.Base
     * @extends $widget.Widget
     */
    $commonWidgets.DataListItem = self
        .addMethods(/** @lends $commonWidgets.DataListItem# */{
            /**
             * Call from host's init.
             * @param {$entity.ItemKey} [itemKey]
             */
            init: function (itemKey) {
                /** @type {$entity.ItemKey} */
                this.itemKey = itemKey;
            },

            /**
             * Associates item widget with an item key.
             * @param {$entity.ItemKey} itemKey
             * @returns {$commonWidgets.DataListItem}
             */
            setItemKey: function (itemKey) {
                $assertion.isItemKey(itemKey, "Invalid item key");
                this.itemKey = itemKey;
                return this;
            },

            /**
             * TODO: Is this necessary? DataList should always be in sync w/ cache.
             * @param {$widget.Widget} parentWidget
             * @returns {$commonWidgets.DataListItem}
             */
            addToParent: function (parentWidget) {
                var childName = this.childName,
                    currentChild = parentWidget.children.getItem(childName);

                $widget.Widget.addToParent.call(this, parentWidget);

                if (currentChild !== this) {
                    // triggering event about being added
                    parentWidget
                        .spawnEvent($commonWidgets.EVENT_DATA_LIST_ITEM_ADD)
                        .setPayloadItem('childWidget', this)
                        .triggerSync();
                }

                return this;
            },

            /**
             * TODO: Is this necessary? DataList should always be in sync w/ cache.
             * @returns {$commonWidgets.DataListItem}
             */
            removeFromParent: function () {
                var parent = this.parent;

                $widget.Widget.removeFromParent.call(this);

                if (parent) {
                    // triggering event about removal
                    parent
                        .spawnEvent($commonWidgets.EVENT_DATA_LIST_ITEM_REMOVE)
                        .setPayloadItem('childWidget', this)
                        .triggerSync();
                }

                return this;
            }
        });
}, jQuery);

$oop.addGlobalConstants.call($commonWidgets, /** @lends $commonWidgets */{
    /**
     * Signals tha a Widget has been added as child.
     * @constant
     */
    EVENT_DATA_LIST_ITEM_ADD: 'widget.list.item.add.data',

    /**
     * Signals that a Widget was removed from its current parent.
     * @constant
     */
    EVENT_DATA_LIST_ITEM_REMOVE: 'widget.list.item.remove.data'
});
