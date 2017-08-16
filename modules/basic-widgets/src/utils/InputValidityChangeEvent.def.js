$oop.postpone($basicWidgets, 'InputValidityChangeEvent', function () {
    "use strict";

    var base = $widget.WidgetEvent,
        self = base.extend();

    /**
     * @name $basicWidgets.InputValidityChangeEvent.create
     * @function
     * @param {string} eventName
     * @param {$event.EventSpace} eventSpace
     * @returns {$basicWidgets.InputValidityChangeEvent}
     */

    /**
     * @class
     * @extends $widget.WidgetEvent
     */
    $basicWidgets.InputValidityChangeEvent = self
        .addMethods(/** @lends $basicWidgets.InputValidityChangeEvent# */{
            /**
             * @param {string} eventName
             * @param {$event.EventSpace} eventSpace
             * @ignore
             */
            init: function (eventName, eventSpace) {
                base.init.call(this, eventName, eventSpace);

                /** @type {boolean} */
                this.wasValid = undefined;

                /** @type {boolean} */
                this.isValid = undefined;
            },

            /**
             * @param {boolean} wasValid
             * @returns {$basicWidgets.InputValidityChangeEvent}
             */
            setWasValid: function (wasValid) {
                this.wasValid = wasValid;
                return this;
            },

            /**
             * @param {boolean} isValid
             * @returns {$basicWidgets.InputValidityChangeEvent}
             */
            setIsValid: function (isValid) {
                this.isValid = isValid;
                return this;
            },

            /**
             * @param {$data.Path} currentPath
             * @returns {$basicWidgets.InputValidityChangeEvent}
             */
            clone: function (currentPath) {
                var result = base.clone.call(this, currentPath);

                result.wasValid = this.wasValid;
                result.isValid = this.isValid;

                return result;
            }
        });
});

$oop.amendPostponed($event, 'Event', function () {
    "use strict";

    $event.Event
        .addSurrogate($basicWidgets, 'InputValidityChangeEvent', function (eventName) {
            return eventName === 'widget.change.input.validity';
        }, 1);
});
