$oop.postpone($commonWidgets, 'Input', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = $widget.Widget,
        self = base.extend(className);

    /**
     * Creates an Input instance.
     * @name $commonWidgets.Input.create
     * @function
     * @param {string} inputType Corresponds to the input tag's type argument.
     * @returns {$commonWidgets.Input}
     */

    /**
     * The Input is the base class for all input widgets: text, checkbox, radio button, etc.
     * Inputs can be validated by supplying a validator function.
     * @class
     * @extends $widget.Widget
     */
    $commonWidgets.Input = self
        .addConstants(/** @lends $commonWidgets.Input */{
            /**
             * @type {object}
             * @constant
             */
            inputTagNames: {
                'input'   : 'input',
                'textarea': 'textarea',
                'select'  : 'select'
            },

            /**
             * @type {object}
             * @constant
             */
            inputTypes: {
                // basic input types
                'button'  : 'button',
                'checkbox': 'checkbox',
                'file'    : 'file',
                'hidden'  : 'hidden',
                'image'   : 'image',
                'password': 'password',
                'radio'   : 'radio',
                'reset'   : 'reset',
                'submit'  : 'submit',
                'text'    : 'text',

                // HTML 5 types
                'color'         : 'color',
                'date'          : 'date',
                'datetime'      : 'datetime',
                'datetime-local': 'datetime-local',
                'email'         : 'email',
                'month'         : 'month',
                'number'        : 'number',
                'range'         : 'range',
                'search'        : 'search',
                'tel'           : 'tel',
                'time'          : 'time',
                'url'           : 'url',
                'week'          : 'week'
            }
        })
        .addPrivateMethods(/** @lends $commonWidgets.Input# */{
            /**
             * @param {*} inputValue
             * @private
             */
            _setInputValue: function (inputValue) {
                this.addAttribute('value', typeof inputValue === 'undefined' ? '' : inputValue);
                this.inputValue = inputValue;
            },

            /** @private */
            _updateDom: function () {
                var element = this.getElement();
                if (element) {
                    $(element).val(this.inputValue);
                }
            },

            /**
             * Triggers change event depending on the current and previous input value.
             * @param {string} oldInputValue Input value before the last change
             * @private
             */
            _triggerChangeEvent: function (oldInputValue) {
                var newInputValue = this.inputValue;

                if (oldInputValue !== newInputValue) {
                    this.spawnEvent($commonWidgets.EVENT_INPUT_VALUE_CHANGE)
                        .setPayloadItems({
                            oldInputValue: oldInputValue,
                            newInputValue: newInputValue
                        })
                        .triggerSync();
                }
            }
        })
        .addMethods(/** @lends $commonWidgets.Input# */{
            /**
             * @param {string} inputType
             * @ignore
             */
            init: function (inputType) {
                $assertion.isInputType(inputType, "Invalid input type");

                base.init.call(this);

                this.elevateMethod('onValueChange');

                /**
                 * Whether input can submit form on enter.
                 * @type {boolean}
                 */
                this.canSubmit = true;

                /**
                 * Current value of the input.
                 * @type {*}
                 */
                this.inputValue = undefined;

                /**
                 * Function that validates the input's value.
                 * Receives the input value as argument and is expected to return undefined when it's valid,
                 * any other value when it's not. Return value will be stored as instance property (lastValidationError)
                 * as well as passed to the validity event as payload.
                 * @type {function}
                 */
                this.validatorFunction = undefined;

                /**
                 * Return value of validatorFunction following the latest input value change.
                 * @type {*}
                 */
                this.lastValidationError = true;

                if (this.inputTagNames[inputType] === inputType) {
                    // setting tag name for input
                    this.setTagName(inputType);
                } else if (this.inputTypes[inputType] === inputType) {
                    // setting input attribute
                    this.setTagName('input')
                        .addAttribute('type', inputType);
                }
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                this.validateInputValue();
                this.subscribeTo($commonWidgets.EVENT_INPUT_VALUE_CHANGE, this.onValueChange);
            },

            /**
             * Sets whether the input can signal to submit the form (if it is in a form).
             * @param {boolean} canSubmit
             * @returns {$commonWidgets.Input}
             */
            setCanSubmit: function (canSubmit) {
                this.canSubmit = canSubmit;
                return this;
            },

            /**
             * Determines whether the input value is currently valid.
             * Input value is valid when the last validation error was undefined.
             * @returns {boolean}
             */
            isValid: function () {
                return this.lastValidationError === undefined;
            },

            /**
             * Sets input value and triggers events.
             * @param {*} inputValue
             * @param {boolean} [updateDom]
             * @returns {$commonWidgets.Input}
             */
            setInputValue: function (inputValue, updateDom) {
                var oldInputValue = this.inputValue;

                this._setInputValue(inputValue);

                if (updateDom) {
                    this._updateDom();
                }

                this._triggerChangeEvent(oldInputValue);

                return this;
            },

            /**
             * Clears input value and triggers events.
             * @param {boolean} [updateDom]
             * @returns {$commonWidgets.Input}
             */
            clearInputValue: function (updateDom) {
                this.setInputValue(undefined, updateDom);
                return this;
            },

            /**
             * Sets validator function. The validator function will be passed the current input value
             * and is expected to return a validation error (code or message) or undefined.
             * @param {function} validatorFunction
             * @returns {$commonWidgets.Input}
             * @see $commonWidgets.Input#validatorFunction
             */
            setValidatorFunction: function (validatorFunction) {
                $assertion.isFunction(validatorFunction, "Invalid validatorFunction function");
                this.validatorFunction = validatorFunction;
                return this;
            },

            /**
             * Updates the validity of the current input value, and triggers validity events accordingly.
             * TODO: Manage validity separately from validationError. Validity should start out as undefined
             * and could take values true or false.
             * @returns {$commonWidgets.Input}
             */
            validateInputValue: function () {
                // validating current value
                var validatorFunction = this.validatorFunction,
                    oldValidationError = this.lastValidationError,
                    newValidationError = validatorFunction && validatorFunction(this.inputValue),
                    wasValid = this.isValid(),
                    isValid = newValidationError === undefined;

                // storing last validation error on instance
                this.lastValidationError = newValidationError;

                // triggering validation event
                if (wasValid && !isValid) {
                    // input just became invalid
                    this.spawnEvent($commonWidgets.EVENT_INPUT_INVALID)
                        .setPayloadItem('newValidationError', newValidationError)
                        .triggerSync();
                } else if (!wasValid && isValid) {
                    // input just became valid
                    this.triggerSync($commonWidgets.EVENT_INPUT_VALID);
                } else if (newValidationError !== oldValidationError) {
                    // triggering event about error change
                    this.spawnEvent($commonWidgets.EVENT_INPUT_ERROR_CHANGE)
                        .setPayloadItems({
                            oldValidationError: oldValidationError,
                            newValidationError: newValidationError
                        })
                        .triggerSync();
                }

                return this;
            },

            /**
             * Focuses on the current input.
             * @returns {$commonWidgets.Input}
             */
            focusOnInput: function () {
                var element = this.getElement();
                if (element) {
                    $(element).focus();
                }
                return this;
            },

            /**
             * Removes focus from the current input.
             * @returns {$commonWidgets.Input}
             */
            blurInput: function () {
                var element = this.getElement();
                if (element) {
                    $(element).focusout();
                }
                return this;
            },

            /**
             * Tells whether current input has the focus.
             * @returns {boolean}
             */
            isFocused: function () {
                var element = this.getElement();
                return element && element === document.activeElement;
            },

            /**
             * Called when input value change is detected on the widget level.
             * Updates value attribute and validity, triggers further widget events.
             * @param {$widget.WidgetEvent} event
             * @ignore
             */
            onValueChange: function (event) {
                var payload = event.payload,
                    oldInputValue = payload.oldInputValue,
                    newInputValue = payload.newInputValue;

                this._setInputValue(newInputValue);

                this.validateInputValue();

                if (newInputValue && !oldInputValue) {
                    this.triggerSync($commonWidgets.EVENT_INPUT_GOT_VALUE);
                } else if (!newInputValue && oldInputValue) {
                    this.triggerSync($commonWidgets.EVENT_INPUT_LOST_VALUE);
                }
            }
        });
}, jQuery);

(function () {
    "use strict";

    $oop.addGlobalConstants.call($commonWidgets, /** @lends $commonWidgets */{
        /**
         * Signals that an Input went from not having a value to having one.
         * @constant
         */
        EVENT_INPUT_GOT_VALUE: 'widget.value.on.input',

        /**
         * Signals that an Input went from having a value to not having one.
         * @constant
         */
        EVENT_INPUT_LOST_VALUE: 'widget.value.off.input',

        /**
         * Signals that an Input came into focus.
         * @constant
         */
        EVENT_INPUT_FOCUS: 'widget.focus.on.input',

        /**
         * Signals that an Input lost focus.
         * @constant
         */
        EVENT_INPUT_BLUR: 'widget.focus.off.input',

        /**
         * Signals that the user pressed TAB while an Input was in focus.
         * @constant
         */
        EVENT_INPUT_TAB: 'widget.press.tab.input',

        /**
         * Signals that the value of an Input changed.
         * @constant
         */
        EVENT_INPUT_VALUE_CHANGE: 'widget.value.change.input',

        /**
         * Signals that an Input went from invalid to valid.
         * @constant
         */
        EVENT_INPUT_VALID: 'widget.validity.on.input',

        /**
         * Signals that an Input went from valid to invalid.
         * @constant
         */
        EVENT_INPUT_INVALID: 'widget.validity.off.input',

        /**
         * Signals that the error associated with an Input changed.
         * @constant
         */
        EVENT_INPUT_ERROR_CHANGE: 'widget.error.change.input',

        /**
         * Signals a form submission initiated on an Input.
         * @constant
         */
        EVENT_INPUT_SUBMIT: 'widget.submit.input'
    });
}());

(function () {
    "use strict";

    $assertion.addTypes(/** @lends $commonWidgets */{
        /** @param {string} expr */
        isInputType: function (expr) {
            return expr &&
                ($commonWidgets.Input.inputTagNames[expr] === expr ||
                $commonWidgets.Input.inputTypes[expr] === expr);
        },

        /** @param {string} expr */
        isInputTypeOptional: function (expr) {
            return $commonWidgets.Input.inputTagNames[expr] === expr ||
                $commonWidgets.Input.inputTypes[expr] === expr;
        }
    });
}());
