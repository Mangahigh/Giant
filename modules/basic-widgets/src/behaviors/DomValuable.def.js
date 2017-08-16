$oop.postpone($basicWidgets, 'DomValuable', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * For widgets that may have a value assigned to them.
     * Expects to be added to Widget hosts, the DOM element of which support value property.
     * @class
     * @extends $oop.Base
     * @extends $widget.Widget
     */
    $basicWidgets.DomValuable = self
        .addPrivateMethods(/** @lends $basicWidgets.DomValuable# */{
            /**
             * @param {HTMLInputElement} element
             * @returns {string}
             * @private
             */
            _getValueProxy: function (element) {
                return element.value;
            },

            /**
             * @param {HTMLInputElement} element
             * @param {*} value
             * @private
             */
            _setValueProxy: function (element, value) {
                element.value = value;
            },

            /** @private */
            _updateDomValue: function () {
                var element = this.getElement(),
                    oldValue,
                    newValue = $utils.Stringifier.stringify(this.value);

                if (element) {
                    oldValue = this._getValueProxy(element);
                    if (newValue !== oldValue) {
                        this._setValueProxy(element, newValue);
                    }
                }
            }
        })
        .addMethods(/** @lends $basicWidgets.DomValuable# */{
            /** Call from host's .init() */
            init: function () {
                /**
                 * Value associated with the DomValuable.
                 * @type {string}
                 */
                this.value = undefined;
            },

            /** Call from host's .afterRender() */
            afterRender: function () {
                this._updateDomValue();
            },

            /**
             * Sets input value.
             * @param {*} value
             * @returns {$basicWidgets.DomValuable}
             */
            setValue: function (value) {
                var oldValue = this.value;
                if (oldValue !== value) {
                    this.value = value;
                    this._updateDomValue();
                    this.spawnEvent($basicWidgets.EVENT_INPUT_VALUE_CHANGE)
                        .setBeforeValue(oldValue)
                        .setAfterValue(value)
                        .triggerSync();
                }
                return this;
            }
        });
});

$oop.addGlobalConstants.call($basicWidgets, /** @lends $basicWidgets */{
    /** @constant */
    EVENT_INPUT_VALUE_CHANGE: 'widget.change.input.value'
});
