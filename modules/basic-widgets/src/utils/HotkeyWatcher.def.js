$oop.postpone($basicWidgets, 'HotkeyWatcher', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * Static class that watches keydown events globally and broadcasts widget events in response.
     * Listen to $basicWidgets.EVENT_HOTKEY_DOWN on any widget to get notified of
     * global key events. (Eg. for navigating within a custom control.)
     * Check originalEvent property, which holds a KeyboardEvent, for details of the keydown.
     * In case you want to suppress hotkey events originating from eg. Input widgets,
     * look at the sender property, or the target of the original KeyboardEvent, depending on what
     * input widget implementation you use.
     * @class
     * @extends $oop.Base
     */
    $basicWidgets.HotkeyWatcher = self
        .addMethods(/** @lends $basicWidgets.HotkeyWatcher */{
            /**
             * @param {KeyboardEvent} event
             * @ignore
             */
            onKeyDown: function (event) {
                var link = $event.pushOriginalEvent(event),
                    rootWidget = $widget.Widget.rootWidget,
                    originWidget = event.toWidget();

                if (rootWidget) {
                    rootWidget
                        .spawnEvent($basicWidgets.EVENT_HOTKEY_DOWN)
                        // TODO: At this point only payload survives broadcasting, not event properties.
                        .setPayloadItems({
                            originWidget: originWidget
                        })
                        .broadcastSync();
                }

                link.unlink();
            }
        });
});

$oop.addGlobalConstants.call($basicWidgets, /** @lends $basicWidgets */{
    /**
     * Signals that a hotkey was pressed.
     * @constant
     */
    EVENT_HOTKEY_DOWN: 'widget.hotkey.down'
});

if (document) {
    // listening to keydown because keypress is not triggered on arrow keys for instance
    document.addEventListener('keydown', function (event) {
        "use strict";

        $basicWidgets.HotkeyWatcher.onKeyDown(event);
    });
}
