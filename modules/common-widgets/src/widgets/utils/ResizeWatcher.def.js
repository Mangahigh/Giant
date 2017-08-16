$oop.postpone($commonWidgets, 'ResizeWatcher', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = $oop.Base,
        self = base.extend(),
        $window = window && $(window);

    /**
     * Creates a ResizeWatcher instance, or pulls up an existing one from registry.
     * @name $commonWidgets.ResizeWatcher.create
     * @function
     * @returns {$commonWidgets.ResizeWatcher}
     */

    /**
     * Singleton that watches window resize events and broadcasts debounced (100ms) widget events in response.
     * Listen to $commonWidgets.EVENT_WINDOW_RESIZE_DEBOUNCED in any widget to get
     * notified of changes to window size.
     * @class
     * @extends $oop.Base
     */
    $commonWidgets.ResizeWatcher = self
        .setInstanceMapper(function () {
            return 'singleton';
        })
        .addConstants(/** @lends $commonWidgets.ResizeWatcher */{
            /**
             * Delay in ms to wait between the last window resize event and
             * triggering the widget resize event.
             * @constant
             */
            RESIZE_DEBOUNCE_DELAY: 100
        })
        .addMethods(/** @lends $commonWidgets.ResizeWatcher# */{
            /** @ignore */
            init: function () {
                this.elevateMethod('onDebouncedWindowResize');

                /**
                 * Stores current window width.
                 * @type {number}
                 */
                this.curentWidth = undefined;

                /**
                 * Stores current window height.
                 * @type {number}
                 */
                this.curentHeight = undefined;

                /**
                 * Debouncer instance for debouncing window resize events, which may come in rapid succession.
                 * @type {$utils.Debouncer}
                 */
                this.windowResizeDebouncer = this.onDebouncedWindowResize.toDebouncer();

                // setting initial dimensions
                this.updateDimensions();
            },

            /**
             * Updates window dimensions, and triggers widget event about resizing.
             * @returns {$commonWidgets.ResizeWatcher}
             */
            updateDimensions: function () {
                var currentWidth = $window.width(),
                    currentHeight = $window.height(),
                    wasWindowResized = false,
                    rootWidget = $widget.Widget.rootWidget;

                if (currentWidth !== this.currentWidth || currentHeight !== this.currentHeight) {
                    wasWindowResized = true;
                }

                this.currentWidth = currentWidth;
                this.currentHeight = currentHeight;

                if (wasWindowResized && rootWidget) {
                    rootWidget.broadcastSync($commonWidgets.EVENT_WINDOW_RESIZE_DEBOUNCED);
                }

                return this;
            },

            /**
             * @param {jQuery.Event} event
             * @ignore
             */
            onWindowResize: function (event) {
                var link = $event.pushOriginalEvent(event);
                this.windowResizeDebouncer.schedule(this.RESIZE_DEBOUNCE_DELAY, event);
                link.unlink();
            },

            /**
             * @ignore
             */
            onDebouncedWindowResize: function () {
                var rootWidget = $widget.Widget.rootWidget;
                if (rootWidget) {
                    this.updateDimensions();
                }
            }
        });
}, jQuery);

(function () {
    "use strict";

    $oop.addGlobalConstants.call($commonWidgets, /** @lends $commonWidgets */{
        /**
         * Signals that the window was resized withing the last 100ms.
         * @constant
         */
        EVENT_WINDOW_RESIZE_DEBOUNCED: 'widget.resize.window.debounced'
    });
}());

(function (/**jQuery*/$) {
    "use strict";

    if (window) {
        $(window).on('resize', function (event) {
            $commonWidgets.ResizeWatcher.create()
                .onWindowResize(event);
        });

        $(function () {
            $commonWidgets.ResizeWatcher.create()
                .updateDimensions();
        });
    }
}(jQuery));