$oop.postpone($basicWidgets, 'TextInput', function (ns, cn) {
    "use strict";

    var base = $widget.Widget,
        self = base.extend(cn)
            // TODO: See where we could ditch ...AndExtend()
            .addTraitAndExtend($basicWidgets.BinaryStateful)
            .addTraitAndExtend($basicWidgets.Disableable, 'Disableable')
            .addTraitAndExtend($basicWidgets.DomInputable, 'DomInputable')
            .addTraitAndExtend($basicWidgets.DomFocusable, 'DomFocusable')
            .addTraitAndExtend($basicWidgets.DomValuable, 'DomValuable')
            .addTraitAndExtend($basicWidgets.Validatable, 'Validatable');

    /**
     * @name $basicWidgets.TextInput.create
     * @function
     * @param {string} [inputType]
     * @returns {$basicWidgets.TextInput}
     */

    /**
     * Simple text-based input field, such as text, password, email, etc.
     * TODO: Handle TAB.
     * @class
     * @extends $widget.Widget
     * @extends $basicWidgets.BinaryStateful
     * @extends $basicWidgets.Disableable
     * @extends $basicWidgets.DomFocusable
     * @extends $basicWidgets.DomValuable
     * @extends $basicWidgets.Validatable
     */
    $basicWidgets.TextInput = self
        .addPrivateMethods(/** @lends $basicWidgets.TextInput# */{
            /**
             * @param {string} inputType
             * @private
             */
            _setInputType: function (inputType) {
                switch (inputType) {
                    case 'textarea':
                        this.setTagName(inputType);
                        break;

                    default:
                    case 'text':
                    case 'password':
                    case 'email':
                    case 'search':
                    case 'tel':
                    case 'url':
                        this.setTagName('input');
                        this.addAttribute('type', inputType);
                        break;
                }
            },

            /**
             * Updates value property based on current DOM value.
             * @private
             */
            _updateValue: function () {
                var element = this.getElement(),
                    newValue = this._getValueProxy(element),
                    oldValue = this.value;

                if (element && oldValue !== newValue) {
                    this.setValue(newValue);
                }
            }
        })
        .addMethods(/** @lends $basicWidgets.TextInput# */{
            /**
             * @param {string} [inputType]
             * @ignore
             */
            init: function (inputType) {
                $assertion.assert(
                    $basicWidgets.INPUT_TYPES_TEXT[inputType] === inputType,
                    "Invalid text input type");

                inputType = inputType || 'text';

                base.init.call(this);
                $basicWidgets.BinaryStateful.init.call(this);
                $basicWidgets.Disableable.init.call(this);
                $basicWidgets.DomFocusable.init.call(this);
                $basicWidgets.DomValuable.init.call(this);
                $basicWidgets.Validatable.init.call(this);

                this.elevateMethods(
                    'onInput',
                    'onChange');

                this._setInputType(inputType);
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                $basicWidgets.BinaryStateful.afterAdd.call(this);
                $basicWidgets.DomInputable.afterAdd.call(this);
                $basicWidgets.Validatable.afterAdd.call(this);
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
                $basicWidgets.DomValuable.afterRender.call(this);

                var element = this.getElement();
                this._addEventListenerProxy(element, 'input', this.onInput);
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
             * Sets input value.
             * @param {*} value
             * @returns {$basicWidgets.TextInput}
             */
            setValue: function (value) {
                $basicWidgets.DomValuable.setValue.call(this, value);
                return this;
            },

            /**
             * @param {Event} event
             * @ignore
             */
            onInput: function (event) {
                var link = $event.pushOriginalEvent(event);
                this._updateValue();
                link.unlink();
            },

            /**
             * @param {Event} event
             * @ignore
             */
            onChange: function (event) {
                var link = $event.pushOriginalEvent(event);
                this._updateValue();
                link.unlink();
            }
        });

    /**
     * @name $basicWidgets.TextInput#_getValueProxy
     * @function
     * @param {HTMLElement} element
     * @returns {string}
     * @private
     */

    /**
     * @name $basicWidgets.TextInput#_addEventListenerProxy
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
    INPUT_TYPES_TEXT: {
        text: 'text',
        password: 'password',
        email: 'email',
        search: 'search',
        tel: 'tel',
        url: 'url',
        textarea: 'textarea'
    }
});
