$oop.postpone($basicWidgets, 'SelectableValueChangeEvent', function () {
    "use strict";

    var base = $widget.WidgetEvent,
        self = base.extend();

    /**
     * @name $basicWidgets.SelectableValueChangeEvent.create
     * @function
     * @param {string} eventName
     * @param {$event.EventSpace} eventSpace
     * @returns {$basicWidgets.SelectableValueChangeEvent}
     */

    /**
     * @class
     * @extends $widget.WidgetEvent
     */
    $basicWidgets.SelectableValueChangeEvent = self
        .addMethods(/** @lends $basicWidgets.SelectableValueChangeEvent# */{
            /**
             * @param {string} eventName
             * @param {$event.EventSpace} eventSpace
             * @ignore
             */
            init: function (eventName, eventSpace) {
                base.init.call(this, eventName, eventSpace);

                /**
                 * @type {*}
                 */
                this.beforeValue = undefined;

                /**
                 * @type {*}
                 */
                this.afterValue = undefined;
            },

            /**
             * @param {*} beforeValue
             * @returns {$basicWidgets.SelectableValueChangeEvent}
             */
            setBeforeValue: function (beforeValue) {
                this.beforeValue = beforeValue;
                return this;
            },

            /**
             * @param {*} afterValue
             * @returns {$basicWidgets.SelectableValueChangeEvent}
             */
            setAfterValue: function (afterValue) {
                this.afterValue = afterValue;
                return this;
            },

            /**
             * @param {$data.Path} currentPath
             * @returns {$basicWidgets.SelectableValueChangeEvent}
             */
            clone: function (currentPath) {
                var result = base.clone.call(this, currentPath);

                result.beforeValue = this.beforeValue;
                result.afterValue = this.afterValue;

                return result;
            }
        });
});

$oop.amendPostponed($event, 'Event', function () {
    "use strict";

    $event.Event
        .addSurrogate($basicWidgets, 'SelectableValueChangeEvent', function (eventName) {
            return eventName === 'widget.change.selectable.value';
        }, 1);
});
