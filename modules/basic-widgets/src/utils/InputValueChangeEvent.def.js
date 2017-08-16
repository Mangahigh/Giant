$oop.postpone($basicWidgets, 'InputValueChangeEvent', function () {
    "use strict";

    var base = $widget.WidgetEvent,
        self = base.extend();

    /**
     * @name $basicWidgets.InputValueChangeEvent.create
     * @function
     * @param {string} eventName
     * @param {$event.EventSpace} eventSpace
     * @returns {$basicWidgets.InputValueChangeEvent}
     */

    /**
     * @class
     * @extends $widget.WidgetEvent
     */
    $basicWidgets.InputValueChangeEvent = self
        .addMethods(/** @lends $basicWidgets.InputValueChangeEvent# */{
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
             * @returns {$basicWidgets.InputValueChangeEvent}
             */
            setBeforeValue: function (beforeValue) {
                this.beforeValue = beforeValue;
                return this;
            },

            /**
             * @param {*} afterValue
             * @returns {$basicWidgets.InputValueChangeEvent}
             */
            setAfterValue: function (afterValue) {
                this.afterValue = afterValue;
                return this;
            },

            /**
             * @param {$data.Path} currentPath
             * @returns {$basicWidgets.InputValueChangeEvent}
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
        .addSurrogate($basicWidgets, 'InputValueChangeEvent', function (eventName) {
            return eventName === 'widget.change.input.value';
        }, 1);
});
