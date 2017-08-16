$oop.postpone($basicWidgets, 'SelectSelectionChangeEvent', function () {
    "use strict";

    var base = $widget.WidgetEvent,
        self = base.extend();

    /**
     * @name $basicWidgets.SelectSelectionChangeEvent.create
     * @function
     * @param {string} eventName
     * @param {$event.EventSpace} eventSpace
     * @returns {$basicWidgets.SelectSelectionChangeEvent}
     */

    /**
     * @class
     * @extends $widget.WidgetEvent
     */
    $basicWidgets.SelectSelectionChangeEvent = self
        .addMethods(/** @lends $basicWidgets.SelectSelectionChangeEvent# */{
            /**
             * @param {string} eventName
             * @param {$event.EventSpace} eventSpace
             * @ignore
             */
            init: function (eventName, eventSpace) {
                base.init.call(this, eventName, eventSpace);

                /** @type {$data.Collection} */
                this.beforeValues = undefined;

                /** @type {$data.Collection} */
                this.afterValues = undefined;

                /** @type {$data.Collection} */
                this.selectedValues = undefined;

                /** @type {$data.Collection} */
                this.deselectedValues = undefined;
            },

            /**
             * @param {$data.Collection} beforeValues
             * @returns {$basicWidgets.SelectSelectionChangeEvent}
             */
            setBeforeValues: function (beforeValues) {
                this.beforeValues = beforeValues;
                return this;
            },

            /**
             * @param {$data.Collection} afterValues
             * @returns {$basicWidgets.SelectSelectionChangeEvent}
             */
            setAfterValues: function (afterValues) {
                this.afterValues = afterValues;
                return this;
            },

            /**
             * @param {$data.Collection} selectedValues
             * @returns {$basicWidgets.SelectSelectionChangeEvent}
             */
            setSelectedValues: function (selectedValues) {
                this.selectedValues = selectedValues;
                return this;
            },

            /**
             * @param {$data.Collection} deselectedValues
             * @returns {$basicWidgets.SelectSelectionChangeEvent}
             */
            setDeselectedValues: function (deselectedValues) {
                this.deselectedValues = deselectedValues;
                return this;
            },

            /**
             * @param {$data.Path} currentPath
             * @returns {$basicWidgets.SelectSelectionChangeEvent}
             */
            clone: function (currentPath) {
                var result = base.clone.call(this, currentPath),
                    beforeValues = this.beforeValues,
                    afterValues = this.afterValues,
                    selectedValues = this.selectedValues,
                    deselectedValues = this.deselectedValues;

                result.beforeValues = beforeValues && beforeValues.clone();
                result.afterValues = afterValues && afterValues.clone();
                result.selectedValues = selectedValues && selectedValues.clone();
                result.deselectedValues = deselectedValues && deselectedValues.clone();

                return result;
            }
        });
});

$oop.amendPostponed($event, 'Event', function () {
    "use strict";

    $event.Event
        .addSurrogate($basicWidgets, 'SelectSelectionChangeEvent', function (eventName) {
            return eventName === 'widget.change.select.selection';
        }, 1);
});
