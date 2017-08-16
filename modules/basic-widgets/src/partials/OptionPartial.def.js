$oop.postpone($basicWidgets, 'OptionPartial', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * Partial class to build widgets that implement the <option> element.
     * Expects the host to be a Widget that has the Disableable trait.
     * @class
     * @extends $oop.Base
     * @extends $widget.Widget
     * @extends $basicWidgets.BinaryStateful
     * @extends $basicWidgets.Disableable
     * @implements $basicWidgets.Selectable
     * @ignore
     */
    $basicWidgets.OptionPartial = self
        .addPrivateMethods(/** @lends $basicWidgets.OptionPartial# */{
            /** @private */
            _updateDisabledAttribute: function () {
                if (this.isDisabled()) {
                    this.addAttribute('disabled', 'disabled');
                } else {
                    this.removeAttribute('disabled');
                }
            },

            /** @private */
            _syncAttributeToSelected: function () {
                var element = this.getElement(),
                    selected = this.selected;

                if (element) {
                    // element available, using element property
                    this._setSelectedProxy(element, selected);
                } else {
                    if (selected) {
                        this.addAttribute('selected', 'true');
                    } else {
                        this.removeAttribute('selected');
                    }
                }
            },

            /** @private */
            _syncSelectedToElement: function () {
                var element = this.getElement(),
                    selectedBefore = this.selected,
                    selectedAfter = element && element.selected;

                if (element) {
                    if (selectedAfter && !selectedBefore) {
                        this.select();
                    } else if (!selectedAfter && selectedBefore) {
                        this.deselect();
                    }
                }
            },

            /**
             * TODO: Move to DOM proxy class.
             * @param {HTMLOptionElement} element
             * @private
             */
            _getSelectedProxy: function (element) {
                return element.selected;
            },

            /**
             * TODO: Move to DOM proxy class.
             * @param {HTMLOptionElement} element
             * @param {boolean} selected
             * @private
             */
            _setSelectedProxy: function (element, selected) {
                element.selected = selected;
            }
        })
        .addMethods(/** @lends $basicWidgets.OptionPartial# */{
            /** Call from host's .init() */
            init: function () {
                this.setTagName('option');

                /**
                 * Whether the option is currently selected.
                 * @type {boolean}
                 */
                this.selected = false;
            },

            /** Call from host's afterAdd */
            afterAdd: function () {
                this._syncAttributeToSelected();
            },

            /** Call from host's afterRender */
            afterRender: function () {
                // updating state in case element got selected by browser on rendering
                // (most likely as default)
                this._syncSelectedToElement();
            },

            /** Call from host's .afterStateOn() */
            afterStateOn: function (stateName) {
                if (stateName === self.STATE_NAME_DISABLED) {
                    this._updateDisabledAttribute();
                }
            },

            /** Call from host's .afterStateOff() */
            afterStateOff: function (stateName) {
                if (stateName === self.STATE_NAME_DISABLED) {
                    this._updateDisabledAttribute();
                }
            },

            /**
             * Retrieves value currently associated with the option.
             * @returns {string}
             */
            getValue: function () {
                return this.htmlAttributes.getItem('value');
            },

            /**
             * Associates value with option.
             * @param {string} value
             * @returns {$basicWidgets.OptionPartial}
             */
            setValue: function (value) {
                var beforeValue = this.getValue();

                if (value !== beforeValue) {
                    this.addAttribute('value', value);

                    // TODO: Should be non-bubbling?
                    this.spawnEvent($basicWidgets.EVENT_SELECTABLE_VALUE_CHANGE)
                        .setBeforeValue(beforeValue)
                        .setAfterValue(value)
                        .triggerSync();
                }

                return this;
            },

            /**
             * Selects the current option if it's added to a select.
             * @returns {$basicWidgets.OptionPartial}
             */
            select: function () {
                if (!this.selected) {
                    this.selected = true;
                    this._syncAttributeToSelected();

                    this.spawnEvent($basicWidgets.EVENT_SELECTABLE_STATE_CHANGE)
                        .setWasSelected(false)
                        .setIsSelected(true)
                        .triggerSync();
                }

                return this;
            },

            /**
             * Selects the current option if it's added to a select.
             * @returns {$basicWidgets.OptionPartial}
             */
            deselect: function () {
                if (this.selected) {
                    this.selected = false;
                    this._syncAttributeToSelected();

                    this.spawnEvent($basicWidgets.EVENT_SELECTABLE_STATE_CHANGE)
                        .setWasSelected(true)
                        .setIsSelected(false)
                        .triggerSync();
                }

                return this;
            }
        });
});
