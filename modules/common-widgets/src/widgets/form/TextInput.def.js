$oop.postpone($commonWidgets, 'TextInput', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = $commonWidgets.Input,
        self = base.extend(className)
            .addTrait($widget.JqueryWidget);

    /**
     * Creates a TextInput instance.
     * PasswordInput instance may also be created by instantiating `$commonWidgets.Input` with the type 'text'.
     * @name $commonWidgets.TextInput.create
     * @function
     * @param {string} [textInputType]
     * @returns {$commonWidgets.TextInput}
     */

    /**
     * The TextInput extends the Input for text input specifically.
     * Implements mostly UI event handlers, and channels them into widget events.
     * Also delegates surrogate to Input: instantiating an Input with 'type'='text' will yield a TextInput instance.
     * @class
     * @extends $commonWidgets.Input
     * @extends $widget.JqueryWidget
     */
    $commonWidgets.TextInput = self
        .addConstants(/** @lends $commonWidgets.Input */{
            /**
             * @type {object}
             * @constant
             */
            inputTagNames: {
                'input'   : 'input',
                'textarea': 'textarea'
            },

            /**
             * @type {object}
             * @constant
             */
            inputTypes: {
                // basic input types
                password: 'password',
                text    : 'text',

                // HTML 5 types
                email   : 'email',
                number  : 'number',
                search  : 'search',
                tel     : 'tel',
                url     : 'url'
            }
        })
        .addPrivateMethods(/** @lends $commonWidgets.TextInput# */{
            /** @private */
            _startChangePolling: function () {
                var that = this;
                this.changePollTimer = setInterval(function () {
                    var element = that.getElement();
                    if (element) {
                        that.setInputValue($(element).val(), false);
                    }
                }, 1000);
            },

            /** @private */
            _stopChangePolling: function () {
                var changePollTimer = this.changePollTimer;
                if (changePollTimer) {
                    clearInterval(changePollTimer);
                    this.changePollTimer = undefined;
                }
            }
        })
        .addMethods(/** @lends $commonWidgets.TextInput# */{
            /**
             * @param {string} textInputType
             * @ignore
             */
            init: function (textInputType) {
                $assertion.isTextInputTypeOptional(textInputType, "Invalid text input type");

                base.init.call(this, textInputType || 'text');

                this
                    .elevateMethod('onFocusIn')
                    .elevateMethod('onFocusOut')
                    .setCanSubmit(textInputType !== 'textarea');

                /**
                 * Timer for polling for input changes.
                 * @type {number}
                 */
                this.changePollTimer = undefined;

                // setting default input value to empty string
                this.inputValue = '';
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);

                if ($commonWidgets.pollInputValues) {
                    this._stopChangePolling();
                }
            },

            /** @ignore */
            afterRender: function () {
                base.afterRender.call(this);

                // TODO: use JqueryWidget based subscription when it's fixed
                var element = this.getElement();

                if (element) {
                    $(element)
                        .on('focusin', this.onFocusIn)
                        .on('focusout', this.onFocusOut);
                }

                if ($commonWidgets.pollInputValues) {
                    this._stopChangePolling();
                    this._startChangePolling();
                }
            },

            /**
             * @param {jQuery.Event} event
             * @ignore
             */
            onKeyDown: function (event) {
                var link = $event.pushOriginalEvent(event);

                switch (event.which) {
                case 13:
                    if (this.canSubmit) {
                        // signaling that the input is attempting to submit the form
                        this.triggerSync($commonWidgets.EVENT_INPUT_SUBMIT);
                    }
                    break;

                case 9:
                    this.triggerSync($commonWidgets.EVENT_INPUT_TAB);
                    break;
                }

                link.unlink();
            },

            /**
             * Triggered on onkeyup, oninput, and onchange.
             * However, does not trigger Input event unless the value actually changed.
             * @param {jQuery.Event} event
             * @ignore
             */
            onChange: function (event) {
                var link = $event.pushOriginalEvent(event),
                    element = this.getElement(),
                    newInputValue;

                if (element) {
                    newInputValue = $(element).val();
                    this.setInputValue(newInputValue);
                }

                link.unlink();
            },

            /**
             * @param {$widget.WidgetEvent} event
             * @ignore
             */
            onFocusIn: function (event) {
                var link = $event.pushOriginalEvent(event);
                this.triggerSync($commonWidgets.EVENT_INPUT_FOCUS);
                link.unlink();
            },

            /**
             * @param {$widget.WidgetEvent} event
             * @ignore
             */
            onFocusOut: function (event) {
                var link = $event.pushOriginalEvent(event);
                this.triggerSync($commonWidgets.EVENT_INPUT_BLUR);
                link.unlink();
            }
        });

    self
        .on('keydown', '', 'onKeyDown')
        .on('keyup input change', '', 'onChange');
}, jQuery);

$oop.amendPostponed($commonWidgets, 'Input', function () {
    "use strict";

    $commonWidgets.Input
        .addSurrogate($commonWidgets, 'TextInput', function (inputType) {
            var TextInput = $commonWidgets.TextInput;
            return TextInput.inputTagNames[inputType] === inputType ||
                   TextInput.inputTypes[inputType] === inputType;
        });
});

(function () {
    "use strict";

    $assertion.addTypes(/** @lends $commonWidgets */{
        /** @param {string} expr */
        isTextInputType: function (expr) {
            var TextInput = $commonWidgets.TextInput;
            return expr &&
                   (TextInput.inputTagNames[expr] === expr ||
                    TextInput.inputTypes[expr] === expr);
        },

        /** @param {string} expr */
        isTextInputTypeOptional: function (expr) {
            var TextInput = $commonWidgets.TextInput;
            return TextInput.inputTypes[expr] === expr ||
                   TextInput.inputTagNames[expr] === expr;
        }
    });
}());
