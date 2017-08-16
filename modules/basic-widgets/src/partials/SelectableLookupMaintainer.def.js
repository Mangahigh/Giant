$oop.postpone($basicWidgets, 'SelectableLookupMaintainer', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * Maintains associations between option widgets and their values.
     * Expects to be added to List widgets.
     * @class
     * @extends $oop.Base
     * @extends $basicWidgets.List
     * @ignore
     */
    $basicWidgets.SelectableLookupMaintainer = self
        .addMethods(/** @lends $basicWidgets.SelectableLookupMaintainer# */{
            /** Call from host's init */
            init: function () {
                this.elevateMethod('onSelectableValueChange');

                /**
                 * All option widgets indexed by their values.
                 * Holds instances of Selectable.
                 * @type {$data.Collection}
                 */
                this.itemWidgetsByValue = $data.Collection.create();
            },

            /** Call from host's afterAdd */
            afterAdd: function () {
                this.subscribeTo($basicWidgets.EVENT_SELECTABLE_VALUE_CHANGE, this.onSelectableValueChange);
            },

            /**
             * Adds item widget to lookup.
             * @param {$basicWidgets.Selectable} itemWidget
             * @returns {$basicWidgets.SelectableLookupMaintainer}
             */
            addItemWidget: function (itemWidget) {
                var itemValue = itemWidget.getValue();

                $assertion
                    .assert(!this.getItemWidgetByValue(itemValue),
                        "Duplicate selectable value");

                // adding option to lookup
                this.itemWidgetsByValue.setItem(itemValue, itemWidget);

                return this;
            },

            /**
             * Removes item widget from lookup.
             * @param {$basicWidgets.Selectable} itemWidget
             * @returns {$basicWidgets.SelectableLookupMaintainer}
             */
            removeItemWidget: function (itemWidget) {
                // removing selectable from lookup
                this.itemWidgetsByValue.deleteItem(itemWidget.getValue());

                return this;
            },

            /**
             * Retrieves the Selectable instance associated with the specified value.
             * @param {string} itemValue
             * @returns {$basicWidgets.Selectable}
             */
            getItemWidgetByValue: function (itemValue) {
                return this.itemWidgetsByValue.getItem(itemValue);
            },

            /**
             * @param {$basicWidgets.InputValueChangeEvent} event
             * @ignore
             */
            onSelectableValueChange: function (event) {
                var beforeValue = event.beforeValue,
                    afterValue = event.afterValue,
                    itemWidgetsByValue = this.itemWidgetsByValue,
                    affectedItemWidget = itemWidgetsByValue.getItem(beforeValue),
                    targetItemWidget = itemWidgetsByValue.getItem(afterValue);

                $assertion.assert(!targetItemWidget, "Target value already exists");

                // moving option widget in lookup
                itemWidgetsByValue
                    .deleteItem(beforeValue)
                    .setItem(afterValue, affectedItemWidget);
            }
        });
});
