$oop.postpone($basicWidgets, 'DataSingleSelect', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.SingleSelect,
        self = base.extend(cn)
            .addTrait($basicWidgets.EntityTagged)
            .addTrait($basicWidgets.EntityInputPartial)
            .addTraitAndExtend($basicWidgets.EntitySelectPartial)
            .addTraitAndExtend($basicWidgets.EntityListPartial);

    /**
     * @name $basicWidgets.DataSingleSelect.create
     * @function
     * @param {$entity.FieldKey} valueKey
     * @param {$entity.FieldKey} [nameKey]
     * @param {$entity.FieldKey} [optionsKey]
     * @returns {$basicWidgets.DataSingleSelect}
     */

    /**
     * @class
     * @extends $basicWidgets.SingleSelect
     * @extends $basicWidgets.EntityTagged
     * @extends $basicWidgets.EntityInputPartial
     * @extends $basicWidgets.EntitySelectPartial
     * @extends $basicWidgets.EntityListPartial
     */
    $basicWidgets.DataSingleSelect = self
        .addPrivateMethods(/** @lends $basicWidgets.DataSingleSelect# */{
            /**
             * TODO: Eliminate in favor of SingleSelect#_syncOptionsToSelection
             * @private
             */
            _syncInputValueToEntity: function () {
                var selectedValueBefore = this.selectedValue,
                    selectedValueAfter = this.valueKey.toField().getValue(),
                    selectedOption,
                    deselectedOption;

                if (selectedValueAfter !== selectedValueBefore) {
                    selectedOption = this.getItemWidgetByValue(selectedValueAfter);
                    deselectedOption = this.getItemWidgetByValue(selectedValueBefore);

                    if (selectedOption) {
                        selectedOption.select();
                    }

                    if (deselectedOption) {
                        deselectedOption.deselect();
                    }
                }
            }
        })
        .addMethods(/** @lends $basicWidgets.DataSingleSelect# */{
            /**
             * @param {$entity.FieldKey} valueKey
             * @param {$entity.FieldKey} [nameKey]
             * @param {$entity.FieldKey} [optionsKey]
             * @ignore
             */
            init: function (valueKey, nameKey, optionsKey) {
                $assertion
                    .isFieldKey(valueKey, "Invalid value key")
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
                    afterValue = event.afterValues.getFirstValue();

                if (selectedKey) {
                    selectedKey.toEntity()
                        .setValue(afterValue);
                }
            }
        });
});
