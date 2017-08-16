$oop.postpone($basicWidgets, 'SelectableStateChangeEvent', function () {
    "use strict";

    var base = $widget.WidgetEvent,
        self = base.extend();

    /**
     * @name $basicWidgets.SelectableStateChangeEvent.create
     * @function
     * @param {string} eventName
     * @param {$event.EventSpace} eventSpace
     * @returns {$basicWidgets.SelectableStateChangeEvent}
     */

    /**
     * @class
     * @extends $widget.WidgetEvent
     */
    $basicWidgets.SelectableStateChangeEvent = self
        .addMethods(/** @lends $basicWidgets.SelectableStateChangeEvent# */{
            /**
             * @param {string} eventName
             * @param {$event.EventSpace} eventSpace
             * @ignore
             */
            init: function (eventName, eventSpace) {
                base.init.call(this, eventName, eventSpace);

                /**
                 * @type {boolean}
                 */
                this.wasSelected = undefined;

                /**
                 * @type {boolean}
                 */
                this.isSelected = undefined;
            },

            /**
             * @param {boolean} wasSelected
             * @returns {$basicWidgets.SelectableStateChangeEvent}
             */
            setWasSelected: function (wasSelected) {
                this.wasSelected = wasSelected;
                return this;
            },

            /**
             * @param {boolean} isSelected
             * @returns {$basicWidgets.SelectableStateChangeEvent}
             */
            setIsSelected: function (isSelected) {
                this.isSelected = isSelected;
                return this;
            },

            /**
             * @param {$data.Path} currentPath
             * @returns {$basicWidgets.SelectableStateChangeEvent}
             */
            clone: function (currentPath) {
                var result = base.clone.call(this, currentPath);

                result.wasSelected = this.wasSelected;
                result.isSelected = this.isSelected;

                return result;
            }
        });
});

$oop.amendPostponed($event, 'Event', function () {
    "use strict";

    $event.Event
        .addSurrogate($basicWidgets, 'SelectableStateChangeEvent', function (eventName) {
            return eventName === 'widget.change.selectable.state';
        }, 1);
});
