$oop.postpone($commonWidgets, 'Form', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = $widget.Widget,
        self = base.extend(className)
            .addTraitAndExtend($commonWidgets.BinaryStateful)
            .addTrait($commonWidgets.Disableable);

    /**
     * Creates a Form instance.
     * @name $commonWidgets.Form.create
     * @function
     * @returns {$commonWidgets.Form}
     */

    /**
     * The Form encloses multiple FormField's, provides validity events for the entire form,
     * and supports submitting the form.
     * TODO: Implement disabling for form elements like inputs, etc.
     * @class
     * @extends $widget.Widget
     * @extends $commonWidgets.BinaryStateful
     * @extends $commonWidgets.Disableable
     */
    $commonWidgets.Form = self
        .addPublic(/** @lends $commonWidgets.Form */{
            /**
             * @type {$widget.MarkupTemplate}
             */
            contentTemplate: [
                '<ul class="inputs-container">',
                '</ul>'
            ].join('').toMarkupTemplate()
        })
        .addPrivateMethods(/** @lends $commonWidgets.Form# */{
            /** @private */
            _updateCounters: function () {
                var formFields = this.getFormFields(),
                    validFieldNames = formFields
                        .callOnEachItem('getInputWidget')
                        .callOnEachItem('isValid')
                        .toStringDictionary()
                        .reverse()
                        .getItem('true');

                this.fieldCount = formFields.getKeyCount();
                this.validFieldCount = validFieldNames ?
                    validFieldNames instanceof Array ?
                        validFieldNames.length :
                        1 :
                    0;
            },

            /**
             * @param {boolean} wasValid
             * @private
             */
            _triggerValidityEvent: function (wasValid) {
                var isValid = this.isValid();

                if (isValid && !wasValid) {
                    this.triggerSync($commonWidgets.EVENT_FORM_INVALID);
                } else if (!isValid && wasValid) {
                    this.triggerSync($commonWidgets.EVENT_FORM_VALID);
                }
            },

            /** @private */
            _triggerSubmissionEvent: function () {
                if (this.validFieldCount === this.fieldCount) {
                    this.triggerSync($commonWidgets.EVENT_FORM_SUBMIT);
                }
            }
        })
        .addMethods(/** @lends $commonWidgets.Form# */{
            /** @ignore */
            init: function () {
                base.init.call(this);
                $commonWidgets.BinaryStateful.init.call(this);
                $commonWidgets.Disableable.init.call(this);

                this.setTagName('form');

                this.elevateMethods(
                    'onSubmit',
                    'onInputSubmit',
                    'onInputValid',
                    'onInputInvalid');

                /**
                 * Total number of fields in the form.
                 * @type {number}
                 */
                this.fieldCount = undefined;

                /**
                 * Total number of valid fields in the form. Equal or less than .fieldCount.
                 * @type {number}
                 */
                this.validFieldCount = undefined;
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);

                this._updateCounters();

                this
                    .subscribeTo($commonWidgets.EVENT_INPUT_SUBMIT, this.onInputSubmit)
                    .subscribeTo($commonWidgets.EVENT_INPUT_VALID, this.onInputValid)
                    .subscribeTo($commonWidgets.EVENT_INPUT_INVALID, this.onInputInvalid);
            },

            /** @ignore */
            afterRender: function () {
                base.afterRender.call(this);

                $(this.getElement())
                    .on('submit', this.onSubmit);
            },

            /**
             * Determines whether the form is valid. The form is valid when and only when all of its fields are valid.
             * @returns {boolean}
             */
            isValid: function () {
                return this.validFieldCount === this.fieldCount;
            },

            /**
             * Adds a field to the form.
             * @param {$commonWidgets.FormField} formField
             * @returns {$commonWidgets.Form}
             */
            addFormField: function (formField) {
                $assertion
                    .isFormField(formField, "Invalid form field")
                    .assert(!this.getChild(formField.childName), "Specified field already exists");

                formField
                    .setTagName('li')
                    .setContainerCssClass('inputs-container')
                    .addToParent(this);

                this.fieldCount++;

                if (formField.getInputWidget().isValid()) {
                    this.validFieldCount++;
                }

                return this;
            },

            /**
             * Fetches the field with the specified name from the form.
             * TODO: make sure returned value is either FormField instance or undefined
             * @param {string} fieldName
             * @returns {$commonWidgets.FormField}
             */
            getFormField: function (fieldName) {
                return this.getChild(fieldName);
            },

            /**
             * Fetches all form field widgets as a WidgetCollection.
             * @returns {$widget.WidgetCollection}
             */
            getFormFields: function () {
                return this.children.filterByType($commonWidgets.FormField);
            },

            /**
             * Fetches input widgets from all form fields.
             * @returns {$data.Collection}
             */
            getInputWidgets: function () {
                return this.getFormFields()
                    .callOnEachItem('getInputWidget');
            },

            /**
             * Fetches input values from all form fields indexed by form field names.
             * @returns {$data.Collection}
             */
            getInputValues: function () {
                return this.getFormFields()
                    .callOnEachItem('getInputValue');
            },

            /**
             * Clears input value in all fields.
             * @param {boolean} [updateDom]
             * @returns {$commonWidgets.Form}
             */
            resetForm: function (updateDom) {
                // clearing input values
                this.getFormFields()
                    .callOnEachItem('clearInputValue', updateDom);

                // broadcasting form reset event so fields can clean up if they want to
                this.broadcastSync($commonWidgets.EVENT_FORM_RESET);

                return this;
            },

            /**
             * Attempts to submit form. It is up to the parent widget to handle the submit event
             * and actually submit the form. (It may not be necessary to submit anything to a server,
             * but rather take some other action.)
             * @returns {$commonWidgets.Form}
             */
            trySubmittingForm: function () {
                this._triggerSubmissionEvent();
                return this;
            },

            /**
             * Puts focus on first field of the form.
             * @returns {$commonWidgets.Form}
             */
            focusOnFirstField: function () {
                var firstField = this.children
                    .filterByType($commonWidgets.FormField)
                    .getSortedValues()[0];

                if (firstField) {
                    firstField.focusOnField();
                }

                return this;
            },

            /**
             * @ignore
             */
            onInputSubmit: function () {
                this.trySubmittingForm();
            },

            /**
             * @ignore
             */
            onInputValid: function () {
                var wasValid = this.isValid();
                this.validFieldCount++;
                this._triggerValidityEvent(wasValid);
            },

            /**
             * @ignore
             */
            onInputInvalid: function () {
                var wasValid = this.isValid();
                this.validFieldCount--;
                this._triggerValidityEvent(wasValid);
            },

            /**
             * @param {jQuery.Event} event
             * @ignore
             */
            onSubmit: function (event) {
                // suppressing native form submission
                event.preventDefault();
            }
        });
}, jQuery);

(function () {
    "use strict";

    $oop.addGlobalConstants.call($commonWidgets, /** @lends $commonWidgets */{
        /**
         * Signals that a Form became valid.
         * @constant
         */
        EVENT_FORM_VALID: 'widget.validity.on.form',

        /**
         * Signals tha a Form became invalid.
         * @constant
         */
        EVENT_FORM_INVALID: 'widget.validity.off.form',

        /**
         * Signals initiation of a Form submission.
         * @constant
         */
        EVENT_FORM_SUBMIT: 'widget.submit.form',

        /**
         * Signals that a Form was reset.
         * @constant
         */
        EVENT_FORM_RESET: 'widget.reset.form'
    });
}());

(function () {
    "use strict";

    $assertion.addTypes(/** @lends $commonWidgets */{
        /** @param {$commonWidgets.Form} expr */
        isForm: function (expr) {
            return $commonWidgets.Form.isBaseOf(expr);
        },

        /** @param {$commonWidgets.Form} [expr] */
        isFormOptional: function (expr) {
            return expr === undefined ||
                $commonWidgets.Form.isBaseOf(expr);
        }
    });
}());
