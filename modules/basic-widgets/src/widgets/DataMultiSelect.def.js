$oop.postpone($basicWidgets, 'DataMultiSelect', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.MultiSelect,
        self = base.extend(cn)
            .addTrait($basicWidgets.EntityTagged)
            .addTrait($basicWidgets.EntityInputPartial)
            .addTraitAndExtend($basicWidgets.EntitySelectPartial)
            .addTraitAndExtend($basicWidgets.EntityListPartial);

    /**
     * @name $basicWidgets.DataMultiSelect.create
     * @function
     * @param {$entity.FieldKey} valueKey
     * @param {$entity.FieldKey} [nameKey]
     * @param {$entity.FieldKey} [optionsKey]
     * @returns {$basicWidgets.DataMultiSelect}
     */

    /**
     * @class
     * @extends $basicWidgets.MultiSelect
     * @extends $basicWidgets.EntityTagged
     * @extends $basicWidgets.EntityInputPartial
     * @extends $basicWidgets.EntitySelectPartial
     * @extends $basicWidgets.EntityListPartial
     */
    $basicWidgets.DataMultiSelect = self
        .addPrivateMethods(/** @lends $basicWidgets.DataMultiSelect# */{
            /** @private */
            _syncInputValueToEntity: function () {
                var selectedKey = this.valueKey,
                    selectedValuesBefore = this.selectedValues.toSet(),
                    selectedValuesAfter = selectedKey.toField().getItemsAsCollection().toSet(),
                    selectedValues = selectedValuesAfter.subtract(selectedValuesBefore).toCollection(),
                    deselectedValues = selectedValuesBefore.subtract(selectedValuesAfter).toCollection();

                // getItemWidgetByValue is elevated by base class
                selectedValues
                    .mapValues(this.getItemWidgetByValue)
                    .callOnEachItem('select');

                deselectedValues
                    .mapValues(this.getItemWidgetByValue)
                    .callOnEachItem('deselect');
            }
        })
        .addMethods(/** @lends $basicWidgets.DataMultiSelect# */{
            /**
             * @param {$entity.FieldKey} valueKey
             * @param {$entity.FieldKey} [nameKey]
             * @param {$entity.FieldKey} [optionsKey]
             * @ignore
             */
            init: function (valueKey, nameKey, optionsKey) {
                $assertion
                    .isFieldKey(valueKey, "Invalid selected key")
                    .assert(
                        !valueKey || valueKey.toField().isA($entity.CollectionField),
                        "Invalid selected field type")
                    .isFieldKeyOptional(nameKey, "Invalid name key")
                    .isFieldKeyOptional(optionsKey, "Invalid options key");

                base.init.call(this);
                $basicWidgets.EntityTagged.init.call(this, valueKey);
                $basicWidgets.EntityInputPartial.init.call(this, valueKey, nameKey);
                if (optionsKey) {
                    $basicWidgets.EntityListPartial.init.call(this, optionsKey);
                }

                this.elevateMethod('onSelectionChange');
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                if (this.listKey) {
                    $basicWidgets.EntityListPartial.afterAdd.call(this);
                }
                $basicWidgets.EntityInputPartial.afterAdd.call(this);

                this.subscribeTo($basicWidgets.EVENT_SELECT_SELECTION_CHANGE, this.onSelectionChange);
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                if (this.listKey) {
                    $basicWidgets.EntityListPartial.afterRemove.call(this);
                }
                $basicWidgets.EntityInputPartial.afterRemove.call(this);
            },

            /**
             * @param {$entity.EntityChangeEvent} event
             * @ignore
             */
            onItemsChange: function (event) {
                $basicWidgets.EntityListPartial.onItemsChange.call(this, event);
                this._syncInputValueToEntity();
            },

            /**
             * @param {$basicWidgets.SelectSelectionChangeEvent} event
             * @ignore
             */
            onSelectionChange: function (event) {
                var selectedKey = this.valueKey,
                    afterValues = event.afterValues.clone();

                if (selectedKey) {
                    selectedKey.toEntity()
                        .setValue(afterValues.items);
                }
            }
        });
});
