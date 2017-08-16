$oop.postpone($basicWidgets, 'Validatable', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * Trait that facilitates validation on an input widget.
     * Expects to be added to widgets that also have the DomValuable trait.
     * @class
     * @extends $oop.Base
     * @extends $widget.Widget
     * @extends $basicWidgets.DomValuable
     */
    $basicWidgets.Validatable = self
        .addPrivateMethods(/** @lends $basicWidgets.Validatable# */{
            /** @private */
            _updateValidityStyle: function () {
                if (this.isValid) {
                    this.addCssClass('input-valid')
                        .removeCssClass('input-invalid');
                } else {
                    this.addCssClass('input-invalid')
                        .removeCssClass('input-valid');
                }
            },

            /** @private */
            _updateValidity: function () {
                var wasValid = this.isValid,
                    isValid = this.getValidity();

                if (isValid !== wasValid) {
                    this.isValid = isValid;

                    this.spawnEvent($basicWidgets.EVENT_INPUT_VALIDITY_CHANGE)
                        .setWasValid(wasValid)
                        .setIsValid(isValid)
                        .triggerSync();
                }
            }
        })
        .addMethods(/** @lends $basicWidgets.Validatable# */{
            /** Call from host's init */
            init: function () {
                this.elevateMethods(
                    'onInputValueChange',
                    'onInputValidityChange');

                /**
                 * Validator, run after value changes.
                 * Takes two arguments: the value to be validated and the validatable instance.
                 * (The latter allows access to native validity checkers, eg. email or url)
                 * @type {function}
                 */
                this.validator = undefined;

                /**
                 * Current validity
                 * @type {boolean}
                 */
                this.isValid = true;
            },

            /** Call from host's afterAdd */
            afterAdd: function () {
                this._updateValidity();
                this._updateValidityStyle();

                this.subscribeTo($basicWidgets.EVENT_INPUT_VALUE_CHANGE, this.onInputValueChange)
                    .subscribeTo($basicWidgets.EVENT_INPUT_VALIDITY_CHANGE, this.onInputValidityChange);
            },

            /**
             * @param {function} validator
             * @returns {$basicWidgets.Validatable}
             */
            setValidator: function (validator) {
                $assertion.isFunctionOptional(validator);
                this.validator = validator;
                this._updateValidity();
                return this;
            },

            /**
             * Determines whether the current validatable instance is valid.
             * When there is no validator specified, default is valid.
             * @returns {boolean}
             */
            getValidity: function () {
                var validator = this.validator;
                return !validator || validator(this.value, this);
            },

            /** @ignore */
            onInputValueChange: function () {
                this._updateValidity();
            },

            /** @ignore */
            onInputValidityChange: function () {
                this._updateValidityStyle();
            }
        });
});

$oop.addGlobalConstants.call($basicWidgets, /** @lends $basicWidgets */{
    /** @constant */
    EVENT_INPUT_VALIDITY_CHANGE: 'widget.change.input.validity'
});
