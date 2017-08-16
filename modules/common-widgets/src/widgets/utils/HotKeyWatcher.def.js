$oop.postpone($commonWidgets, 'HotKeyWatcher', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * Static class that watches key events globally and broadcasts widget events in response.
     * Listen to $commonWidgets.EVENT_HOT_KEY_DOWN in any widget to get notified of
     * global key events. (Eg. for navigating within a custom control.)
     * In case you want to suppress hotkey events originating from eg. Input widgets,
     * query the original events and look at the target that received the keydown.
     * @class
     * @extends $oop.Base
     */
    $commonWidgets.HotKeyWatcher = self
        .addMethods(/** @lends $commonWidgets.HotKeyWatcher# */{
            /**
             * @param {jQuery.Event} event
             * @ignore
             */
            onKeyDown: function (event) {
                var link = $event.pushOriginalEvent(event),
                    rootWidget = $widget.Widget.rootWidget,
                    keyboardEvent = event.originalEvent,
                    originWidget = keyboardEvent instanceof Event &&
                        keyboardEvent.toWidget() ||
                        rootWidget;

                if (rootWidget) {
                    rootWidget
                        .spawnEvent($commonWidgets.EVENT_HOT_KEY_DOWN)
                        .setPayloadItems({
                            charCode: event.which,
                            originWidget: originWidget
                        })
                        .broadcastSync();
                }

                link.unlink();
            }
        });
});

(function () {
    "use strict";

    $oop.addGlobalConstants.call($commonWidgets, /** @lends $commonWidgets */{
        /**
         * Signals that a hot key was pressed.
         * @constant
         */
        EVENT_HOT_KEY_DOWN: 'widget.press.hotKey'
    });
}());

(function (/**jQuery*/$) {
    "use strict";

    if (document) {
        $(document).on('keydown', function (event) {
            $commonWidgets.HotKeyWatcher.onKeyDown(event);
        });
    }
}(jQuery));