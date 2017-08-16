$oop.postpone($basicWidgets, 'BinaryInput', function (ns, cn) {
    "use strict";

    var base = $widget.Widget,
        self = base.extend(cn)
            .addTraitAndExtend($basicWidgets.BinaryStateful)
            .addTraitAndExtend($basicWidgets.Disableable, 'Disableable')
            .addTraitAndExtend($basicWidgets.DomInputable, 'DomInputable')
            .addTraitAndExtend($basicWidgets.DomFocusable, 'DomFocusable');

    /**
     * @name $basicWidgets.BinaryInput.create
     * @function
     * @param {string} [inputType]
     * @returns {$basicWidgets.BinaryInput}
     */

    /**
     * Implements checkbox or radio button.
     * TODO: What about mixed state? Use undefined?
     * @class
     * @extends $widget.Widget
     * @extends $basicWidgets.BinaryStateful
     * @extends $basicWidgets.Disableable
     * @extends $basicWidgets.DomFocusable
     * @extends $basicWidgets.DomInputable
     * @implements $basicWidgets.Selectable
     */
    $basicWidgets.BinaryInput = self
        .addPrivateMethods(/** @lends $basicWidgets.BinaryInput# */{
            /**
             * @param {HTMLInputElement} element
             * @param {*} value
             * @private
             */
            _setCheckedProxy: function (element, value) {
                element.checked = value;
            },

            /**
             * @param {HTMLInputElement} element
             * @returns {*}
             * @private
             */
            _getCheckedProxy: function (element) {
                return element.checked;
            },

            /** @private */
            _syncStateToDom: function () {
                var element = this.getElement(),
                    checked;

                if (element) {
                    checked = this._getCheckedProxy(element);
                    if (checked) {
                        this.select();
                    } else {
                        this.deselect();
                    }
                }
            },

            /** @private */
            _syncDomToState: function () {
                var element = this.getElement(),
                    checked;

                if (element) {
                    checked = this._getCheckedProxy(element);
                    if (this.selected !== checked) {
                        this._setCheckedProxy(element, this.selected);
                    }
                }
            },

            /**
             * @param {boolean} selected
             * @private
             */
            _setSelected: function (selected) {
                var wasSelected = this.selected;

                if (wasSelected !== selected) {
                    this.selected = selected;
                    this._syncDomToState();

                    this.spawnEvent($basicWidgets.EVENT_SELECTABLE_STATE_CHANGE)
                        .setWasSelected(wasSelected)
                        .setIsSelected(selected)
                        .triggerSync();
                }
            }
        })
        .addMethods(/** @lends $basicWidgets.BinaryInput# */{
            /**
             * TODO: Either checkbox or radio.
             * @param {string} [inputType]
             * @ignore
             */
            init: function (inputType) {
                $assertion.assert(
                    $basicWidgets.INPUT_TYPES_BINARY[inputType] === inputType,
                    "Invalid binary input type");

                inputType = inputType || 'checkbox';

                base.init.call(this);
                $basicWidgets.BinaryStateful.init.call(this);
                $basicWidgets.Disableable.init.call(this);
                $basicWidgets.DomFocusable.init.call(this);

                this.elevateMethods(
                    'onInput',
                    'onChange');

                /**
                 * Whether the input is checked.
                 * @type {boolean}
                 */
                this.selected = undefined;

                this.setTagName('input')
                    .addAttribute('type', inputType);
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                $basicWidgets.BinaryStateful.afterAdd.call(this);
                $basicWidgets.DomInputable.afterAdd.call(this);
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                $basicWidgets.BinaryStateful.afterRemove.call(this);
            },

            /** @ignore */
            afterRender: function () {
                base.afterRender.call(this);
                $basicWidgets.DomFocusable.afterRender.call(this);

                this._syncDomToState();

                var element = this.getElement();
                this._addEventListenerProxy(element, 'input', this.onInput);
                this._addEventListenerProxy(element, 'change', this.onChange);
            },

            /** @ignore */
            afterStateOn: function (stateName) {
                $basicWidgets.Disableable.afterStateOn.call(this, stateName);
                $basicWidgets.DomInputable.afterStateOn.call(this, stateName);
            },

            /** @ignore */
            afterStateOff: function (stateName) {
                $basicWidgets.Disableable.afterStateOff.call(this, stateName);
                $basicWidgets.DomInputable.afterStateOff.call(this, stateName);
            },

            /**
             * Retrieves value HTML attribute.
             * @returns {string}
             */
            getValue: function () {
                return this.htmlAttributes.getItem('value');
            },

            /**
             * Sets base value for the input.
             * Base value used as the input's value when it's checked.
             * @param {string} value
             * @returns {$basicWidgets.BinaryInput}
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
             * Selects input and triggers appropriate events.
             * @returns {$basicWidgets.BinaryInput}
             */
            select: function () {
                this._setSelected(true);
                return this;
            },

            /**
             * Deselects input and triggers appropriate events.
             * @returns {$basicWidgets.BinaryInput}
             */
            deselect: function () {
                this._setSelected(false);
                return this;
            },

            /**
             * @param {Event} event
             * @ignore
             */
            onInput: function (event) {
                var link = $event.pushOriginalEvent(event);
                this._syncStateToDom();
                link.unlink();
            },

            /**
             * @param {Event} event
             * @ignore
             */
            onChange: function (event) {
                var link = $event.pushOriginalEvent(event);
                this._syncStateToDom();
                link.unlink();
            }
        });

    /**
     * @name $basicWidgets.BinaryInput#_addEventListenerProxy
     * @function
     * @param {HTMLElement} element
     * @param {string} type
     * @param {function} callback
     * @private
     */
});

$oop.addGlobalConstants.call($basicWidgets, /** @lends $basicWidgets */{
    /**
     * @type {object}
     * @constant
     */
    INPUT_TYPES_BINARY: {
        checkbox: 'checkbox',
        radio: 'radio'
    }
});
