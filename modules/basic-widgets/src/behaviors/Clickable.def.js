$oop.postpone($basicWidgets, 'Clickable', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * Makes host class a target for mouse clicks / taps.
     * Expects to be added to Widget instances.
     * TODO: Rename to DomClickable?
     * @class
     * @extends $oop.Base
     * @extends $widget.Widget
     */
    $basicWidgets.Clickable = self
        .addPrivateMethods(/** @lends $basicWidgets.ClickArea# */{
            /**
             * TODO: Move to DomProxy static class.
             * @param {Element} element
             * @param {string} type
             * @param {function} callback
             * @private
             */
            _addEventListenerProxy: function (element, type, callback) {
                return element.addEventListener(type, callback);
            }
        })
        .addMethods(/** @lends $basicWidgets.Clickable */{
            /**
             * Call from host's .init
             */
            init: function () {
                this.elevateMethod('onClick');
            },

            /**
             * Call from host's .afterRender
             */
            afterRender: function () {
                this._addEventListenerProxy(this.getElement(), 'click', this.onClick);
            },

            /**
             * Clicks the widget.
             * Call this method for controlling the widget externally.
             * @returns {$basicWidgets.Clickable}
             */
            click: function () {
                this.triggerSync($basicWidgets.EVENT_CLICKABLE_CLICK);
                return this;
            },

            /**
             * @param {Event} event
             * @ignore */
            onClick: function (event) {
                var link = $event.pushOriginalEvent(event);
                this.click();
                link.unlink();
            }
        });
});

(function () {
    "use strict";

    $oop.addGlobalConstants.call($basicWidgets, /** @lends $basicWidgets */{
        /**
         * Signals that a Clickable was clicked.
         * @constants
         */
        EVENT_CLICKABLE_CLICK: 'widget.clickable.click'
    });
}());
