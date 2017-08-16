$oop.postpone($basicWidgets, 'EntitySelectPartial', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * Maintains selected field key, and provides default item widget & name spawners.
     * Expects to be added to widgets having the EntityListPartial partial.
     * @class
     * @extends $oop.Base
     * @extends $widget.Widget
     * @extends $basicWidgets.EntityListPartial
     * @ignore
     */
    $basicWidgets.EntitySelectPartial = self
        .addMethods(/** @lends $basicWidgets.EntitySelectPartial# */{
            /**
             * @param {$entity.ItemKey} itemKey
             * @returns {$basicWidgets.OptionPartial}
             * @ignore
             */
            spawnItemWidget: function (itemKey) {
                return $basicWidgets.DataOption.create(itemKey)
                    .setValue(itemKey.itemId);
            },

            /**
             * TODO: Should allow item value to be used.
             * @param {$entity.ItemKey} itemKey
             * @returns {string}
             * @ignore
             */
            spawnItemName: function (itemKey) {
                return itemKey.itemId;
            }
        });
});
