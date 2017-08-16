$oop.postpone($commonWidgets, 'DataDropdownButton', function (ns, className) {
    "use strict";

    var base = $commonWidgets.DropdownButton,
        self = base.extend(className)
            .addTrait($entity.EntityBound)
            .addTrait($commonWidgets.EntityWidget);

    /**
     * @name $commonWidgets.DataDropdownButton.create
     * @function
     * @param {$entity.FieldKey} labelKey
     * @param {$entity.FieldKey} optionsKey
     * @returns {$commonWidgets.DataDropdownButton}
     */

    /**
     * TODO: Add documentation
     * @class
     * @extends $commonWidgets.DropdownButton
     * @extends $commonWidgets.EntityWidget
     */
    $commonWidgets.DataDropdownButton = self
        .addPrivateMethods(/** @lends $commonWidgets.DataDropdownButton# */{
            /** @private */
            _updateSelectedOption: function () {
                var optionValue = this.entityKey.toField().getValue(),
                    optionWidget = this.dropdown.getListWidget().getOptionByValue(optionValue),
                    dropdownWidget = this.getDropdownWidget();

                if (optionWidget && dropdownWidget) {
                    dropdownWidget.getListWidget()
                        .selectOption(optionWidget.childName);
                }
            }
        })
        .addMethods(/** @lends $commonWidgets.DataDropdownButton# */{
            /**
             * @param {$entity.FieldKey} selectedKey
             * @param {$entity.FieldKey} optionsKey
             * @ignore
             */
            init: function (selectedKey, optionsKey) {
                $assertion
                    .isFieldKey(selectedKey, "Invalid 'selected' field key")
                    .isFieldKey(optionsKey, "Invalid options field key");

                /**
                 * Field key that identifies the options
                 * @type {$entity.FieldKey}
                 */
                this.optionsKey = optionsKey;

                $commonWidgets.EntityWidget.init.call(this, selectedKey);
                base.init.call(this);
                $entity.EntityBound.init.call(this);

                this
                    .elevateMethod('onOptionSelect')
                    .elevateMethod('onListItemsChange');
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);

                this._updateSelectedOption();

                this
                    .bindToEntityChange(this.entityKey, 'onSelectedChange')
                    .subscribeTo($commonWidgets.EVENT_LIST_ITEMS_CHANGE, this.onListItemsChange)
                    .subscribeTo($commonWidgets.EVENT_OPTION_SELECT, this.onOptionSelect);
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                this.unbindAll();
            },

            /** @returns {$commonWidgets.DataLabel} */
            spawnLabelWidget: function () {
                return $commonWidgets.DataLabel.create(this.entityKey);
            },

            /** @returns {$commonWidgets.DataDropdown} */
            spawnDropdownWidget: function () {
                return $commonWidgets.DataDropdown.create(this.optionsKey);
            },

            /**
             * @ignore
             */
            onSelectedChange: function () {
                this._updateSelectedOption();
            },

            /**
             * @ignore
             */
            onListItemsChange: function () {
                this._updateSelectedOption();
            },

            /**
             * @param {$widget.WidgetEvent} event
             * @ignore
             */
            onOptionSelect: function (event) {
                var optionValue = event.payload.optionValue;
                this.entityKey.toField()
                    .setValue(optionValue);
            }
        });
});
