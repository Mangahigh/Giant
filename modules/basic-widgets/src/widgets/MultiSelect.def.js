$oop.postpone($basicWidgets, 'MultiSelect', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.List,
        self = base.extend(cn)
            .addTraitAndExtend($basicWidgets.SelectableLookupMaintainer)
            .addTrait($basicWidgets.SelectPartial)
            .addTraitAndExtend($basicWidgets.BinaryStateful)
            .addTraitAndExtend($basicWidgets.Disableable, 'Disableable')
            .addTraitAndExtend($basicWidgets.DomInputable, 'DomInputable'),
        slice = Array.prototype.slice;

    /**
     * @name $basicWidgets.MultiSelect.create
     * @function
     * @returns {$basicWidgets.MultiSelect}
     */

    /**
     * Dom-native select dropdown with multiple selections.
     * @class
     * @extends $basicWidgets.List
     * @extends $basicWidgets.SelectableLookupMaintainer
     * @extends $basicWidgets.SelectPartial
     * @extends $basicWidgets.BinaryStateful
     * @extends $basicWidgets.Disableable
     * @extends $basicWidgets.DomInputable
     */
    $basicWidgets.MultiSelect = self
        .addPrivateMethods(/** @lends $basicWidgets.MultiSelect# */{
            /**
             * TODO: Move to DomProxy static class.
             * @param {Element} element
             * @param {string} type
             * @param {function} callback
             * @private
             */
            _addEventListenerProxy: function (element, type, callback) {
                return element.addEventListener(type, callback);
            },

            /**
             * TODO: Move to DomProxy static class.
             * @param {Element} element
             * @private
             */
            _valueGetterProxy: function (element) {
                return element.value;
            },

            /**
             * TODO: Move to DomProxy static class.
             * @param {HTMLSelectElement} element
             * @returns {HTMLCollection}
             * @private
             */
            _selectedOptionsGetterProxy: function (element) {
                return element.selectedOptions;
            },

            /** @private */
            _syncOptionsToSelection: function () {
                var selectedValuesBefore = this.itemWidgetsByValue
                        .filterBySelector(function (optionWidget) {
                            return optionWidget.selected;
                        })
                        .mapValues(function (optionWidget, optionValue) {
                            return optionValue;
                        })
                        .toSet(),
                    selectedValuesAfter = this.selectedValues.toSet(),
                    selectedValues = selectedValuesAfter.subtract(selectedValuesBefore).toCollection(),
                    deselectedValues = selectedValuesBefore.subtract(selectedValuesAfter).toCollection();

                selectedValues
                    .mapValues(this.getItemWidgetByValue)
                    .callOnEachItem('select');

                deselectedValues
                    .mapValues(this.getItemWidgetByValue)
                    .callOnEachItem('deselect');
            },

            /** @private */
            _updateLastSelectedValues: function () {
                var selectedValuesBefore = this._lastSelectedValues,
                    selectedValuesAfter = this.selectedValues;

                // recording currently selected values for comparison
                this._lastSelectedValues = selectedValuesAfter.clone();

                this.spawnEvent($basicWidgets.EVENT_SELECT_SELECTION_CHANGE)
                    .setBeforeValues(selectedValuesBefore)
                    .setAfterValues(selectedValuesAfter)
                    .triggerSync();
            }
        })
        .addMethods(/** @lends $basicWidgets.MultiSelect# */{
            /** @ignore */
            init: function () {
                base.init.call(this);
                $basicWidgets.SelectableLookupMaintainer.init.call(this);
                $basicWidgets.SelectPartial.init.call(this);
                $basicWidgets.BinaryStateful.init.call(this);
                $basicWidgets.Disableable.init.call(this);

                this.elevateMethods(
                    '_valueGetterProxy',
                    '_updateLastSelectedValues',
                    'getItemWidgetByValue',
                    'onChange',
                    'onSelectableStateChange');

                this.addAttribute('multiple', 'true');

                /**
                 * Selected values before the last option select event.
                 * @type {$data.Collection}
                 * @private
                 */
                this._lastSelectedValues = $data.Collection.create();

                /**
                 * Debouncer for triggering selection change events.
                 * Debouncing makes sure that a burst of synchronous option select/deselect events
                 * does not trigger more than one selection change event.
                 * @type {$utils.Debouncer}
                 * @private
                 */
                this._updateLastSelectedValuesDebouncer = this._updateLastSelectedValues.toDebouncer();

                /**
                 * Values that are currently selected.
                 * Symmetric key-value pairs.
                 * @type {$data.Collection}
                 */
                this.selectedValues = $data.Collection.create();
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                $basicWidgets.SelectableLookupMaintainer.afterAdd.call(this);
                $basicWidgets.BinaryStateful.afterAdd.call(this);
                $basicWidgets.DomInputable.afterAdd.call(this);

                this._syncOptionsToSelection();

                this.subscribeTo($basicWidgets.EVENT_SELECTABLE_STATE_CHANGE, this.onSelectableStateChange);
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                $basicWidgets.BinaryStateful.afterRemove.call(this);
            },

            /** @ignore */
            afterRender: function () {
                base.afterRender.call(this);

                var element = this.getElement();
                this._addEventListenerProxy(element, 'change', this.onChange);
            },

            /** Call from host's .afterStateOn */
            afterStateOn: function (stateName) {
                $basicWidgets.Disableable.afterStateOn.call(this, stateName);
                $basicWidgets.DomInputable.afterStateOn.call(this, stateName);
            },

            /** Call from host's .afterStateOff */
            afterStateOff: function (stateName) {
                $basicWidgets.Disableable.afterStateOff.call(this, stateName);
                $basicWidgets.DomInputable.afterStateOff.call(this, stateName);
            },

            /**
             * @param {$basicWidgets.OptionPartial} itemWidget
             * @returns {$basicWidgets.MultiSelect}
             */
            addItemWidget: function (itemWidget) {
                base.addItemWidget.call(this, itemWidget);
                $basicWidgets.SelectableLookupMaintainer.addItemWidget.call(this, itemWidget);
                $basicWidgets.SelectPartial.addItemWidget.call(this, itemWidget);

                var optionValue;

                if (itemWidget.selected) {
                    // TODO: Add test
                    optionValue = itemWidget.getValue();
                    this.selectedValues.setItem(optionValue, optionValue);
                    this._updateLastSelectedValuesDebouncer.schedule(0);
                }

                return this;
            },

            /**
             * @param {$basicWidgets.OptionPartial} itemWidget
             * @returns {$basicWidgets.MultiSelect}
             */
            removeItemWidget: function (itemWidget) {
                base.removeItemWidget.call(this, itemWidget);
                $basicWidgets.SelectableLookupMaintainer.removeItemWidget.call(this, itemWidget);

                var optionValue;

                if (itemWidget.selected) {
                    // TODO: Add test
                    optionValue = itemWidget.getValue();
                    this.selectedValues.deleteItem(optionValue);
                    this._updateLastSelectedValuesDebouncer.schedule(0);
                }

                return this;
            },

            /**
             * @param {Event} event
             * @ignore
             */
            onChange: function (event) {
                var link = $event.pushOriginalEvent(event);

                var selectedOptionElements = this._selectedOptionsGetterProxy(this.getElement()),
                    selectedValuesBefore = this.selectedValues.toSet(),
                    selectedValuesAfter = slice.call(selectedOptionElements).toCollection()
                        .mapValues(this._valueGetterProxy)
                        .mapKeys(function (value) {
                            return value;
                        })
                        .toSet(),
                    selectedValues = selectedValuesAfter.subtract(selectedValuesBefore).toCollection(),
                    deselectedValues = selectedValuesBefore.subtract(selectedValuesAfter).toCollection();

                selectedValues
                    .mapValues(this.getItemWidgetByValue)
                    .callOnEachItem('select');

                deselectedValues
                    .mapValues(this.getItemWidgetByValue)
                    .callOnEachItem('deselect');

                link.unlink();
            },

            /**
             * @param {$basicWidgets.InputValueChangeEvent} event
             * @ignore
             */
            onSelectableValueChange: function (event) {
                $basicWidgets.SelectableLookupMaintainer
                    .onSelectableValueChange.call(this, event);

                var beforeValue = event.beforeValue,
                    afterValue = event.afterValue,
                    selectedValues = this.selectedValues;

                if (selectedValues.getItem(beforeValue)) {
                    // select has this option selected
                    // replacing selected value
                    selectedValues
                        .deleteItem(beforeValue)
                        .setItem(afterValue, afterValue);
                }

                this._updateLastSelectedValuesDebouncer.schedule(0);
            },

            /**
             * When a single option got selected or de-selected.
             * @param {$event.Event} event
             * @ignore
             */
            onSelectableStateChange: function (event) {
                var affectedOptionWidget = event.sender,
                    affectedValue = affectedOptionWidget.getValue(),
                    selectedValues = this.selectedValues,
                    isSelected = affectedOptionWidget.selected;

                // updating selected values
                if (isSelected) {
                    selectedValues.setItem(affectedValue, affectedValue);
                } else {
                    selectedValues.deleteItem(affectedValue);
                }

                this._updateLastSelectedValuesDebouncer.schedule(0);
            }
        });
});
