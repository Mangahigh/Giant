$oop.postpone($basicWidgets, 'DomFocusable', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * For widgets that may be focused and blurred.
     * Expects to be added to Widget hosts, the DOM of which support focus and blur events.
     * @class
     * @extends $oop.Base
     * @extends $widget.Widget
     */
    $basicWidgets.DomFocusable = self
        .addPrivateMethods(/** @lends $basicWidgets.DomFocusable# */{
            /**
             * @param {HTMLElement} element
             * @param {string} type
             * @param {function} callback
             * @private
             */
            _addEventListenerProxy: function (element, type, callback) {
                return element.addEventListener(type, callback);
            },

            /**
             * @returns {DocumentView}
             * @private
             */
            _activeElementGetterProxy: function () {
                return document.activeElement;
            },

            /**
             * @param {HTMLInputElement} element
             * @private
             */
            _focusProxy: function (element) {
                return element.focus();
            },

            /**
             * @param {HTMLInputElement} element
             * @private
             */
            _blurProxy: function (element) {
                return element.blur();
            }
        })
        .addMethods(/** @lends $basicWidgets.DomFocusable# */{
            /** Call from host's .init() */
            init: function () {
                this.elevateMethods(
                    'onFocusIn',
                    'onFocusOut');
            },

            /** Call from host's .afterRender() */
            afterRender: function () {
                var element = this.getElement();
                this._addEventListenerProxy(element, 'focusin', this.onFocusIn);
                this._addEventListenerProxy(element, 'focusout', this.onFocusOut);
            },

            /**
             * Focuses on the current input.
             * @returns {$basicWidgets.DomFocusable}
             */
            focus: function () {
                var element = this.getElement();
                if (element) {
                    this._focusProxy(element);
                }
                return this;
            },

            /**
             * Removes focus from the current input.
             * @returns {$basicWidgets.DomFocusable}
             */
            blur: function () {
                var element = this.getElement();
                if (element) {
                    this._blurProxy(element);
                }
                return this;
            },

            /**
             * Tells whether current input has the focus.
             * @returns {boolean}
             */
            isFocused: function () {
                var element = this.getElement();
                return element && element === this._activeElementGetterProxy();
            },

            /**
             * @param {Event} event
             * @ignore
             */
            onFocusIn: function (event) {
                var link = $event.pushOriginalEvent(event);
                this.triggerSync($basicWidgets.EVENT_INPUT_FOCUS);
                link.unlink();
            },

            /**
             * @param {Event} event
             * @ignore
             */
            onFocusOut: function (event) {
                var link = $event.pushOriginalEvent(event);
                this.triggerSync($basicWidgets.EVENT_INPUT_BLUR);
                link.unlink();
            }
        });
});

(function () {
    "use strict";

    $oop.addGlobalConstants.call($basicWidgets, /** @lends $basicWidgets */{
        /** @constant */
        EVENT_INPUT_FOCUS: 'widget.focus.input',

        /** @constant */
        EVENT_INPUT_BLUR: 'widget.blur.input'
    });
}());
