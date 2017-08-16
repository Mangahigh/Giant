$oop.postpone($commonWidgets, 'Editable', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * The Editable trait provides a simple way to manage state changes for widgets that may operate
     * in two modes: display mode, and edit mode, each mode implementing a different markup.
     * TODO: Refactor .editMarkup() and .displayMarkup() into .editTemplate and .displayTemplate.
     * @class
     * @extends $oop.Base
     * @extends $commonWidgets.BinaryStateful
     */
    $commonWidgets.Editable = self
        .addConstants(/** @lends $commonWidgets.Editable */{
            /** @constant */
            STATE_NAME_EDITABLE: 'state-editable'
        })
        .addPrivateMethods(/** @lends $commonWidgets.Editable# */{
            /** @private */
            _updateEditableState: function () {
                var eventName;

                // applying appropriate CSS classes
                if (this.isStateOn(self.STATE_NAME_EDITABLE)) {
                    eventName = $commonWidgets.EVENT_EDITABLE_EDIT_MODE;

                    this.removeCssClass('display-mode')
                        .addCssClass('edit-mode');
                } else {
                    eventName = $commonWidgets.EVENT_EDITABLE_DISPLAY_MODE;

                    this.removeCssClass('edit-mode')
                        .addCssClass('display-mode');
                }

                if (this.editMarkup || this.displayMarkup) {
                    // when host implements different markups for display and edit mode
                    // re-rendering appropriate content markup
                    this.reRenderContents();
                }

                // triggering event about state change
                this.spawnEvent(eventName)
                    .allowBubbling(false)
                    .triggerSync();
            }
        })
        .addMethods(/** @lends $commonWidgets.Editable# */{
            /** Call from host's .init */
            init: function () {
                // expansion is not cascading (by default)
                this.addBinaryState(self.STATE_NAME_EDITABLE);
            },

            /** Call from host's .afterAdd */
            afterAdd: function () {
                this._updateEditableState();
            },

            /**
             * Call from host's .contentMarkup, and implement .editMarkup and .displayMarkup
             * if the host changes its markup between 'edit' and 'display' modes.
             * @returns {string}
             */
            contentMarkup: function () {
                return this.isStateOn(self.STATE_NAME_EDITABLE) ?
                    this.editMarkup() :
                    this.displayMarkup();
            },

            /**
             * Call from host's .afterStateOn.
             * @param {string} stateName
             */
            afterStateOn: function (stateName) {
                if (stateName === self.STATE_NAME_EDITABLE) {
                    this._updateEditableState();
                }
            },

            /**
             * Call from host's .afterStateOff.
             * @param {string} stateName
             */
            afterStateOff: function (stateName) {
                if (stateName === self.STATE_NAME_EDITABLE) {
                    this._updateEditableState();
                }
            },

            /**
             * Sets the host to edit mode.
             * @returns {$commonWidgets.Editable}
             */
            toEditMode: function () {
                this.addBinaryStateSource(self.STATE_NAME_EDITABLE, 'default');
                return this;
            },

            /**
             * Sets the host to display mode.
             * @returns {$commonWidgets.Editable}
             */
            toDisplayMode: function () {
                this.removeBinaryStateSource(self.STATE_NAME_EDITABLE, 'default');
                return this;
            },

            /**
             * Tells whether host is in edit mode.
             * @returns {boolean}
             */
            isInEditMode: function () {
                return this.isStateOn(self.STATE_NAME_EDITABLE);
            },

            /**
             * Tells whether host is in display mode.
             * @returns {boolean}
             */
            isInDisplayMode: function () {
                return !this.isStateOn(self.STATE_NAME_EDITABLE);
            }
        });

    /**
     * @name $commonWidgets.Editable#editMarkup
     * @function
     * @returns {string}
     */

    /**
     * @name $commonWidgets.Editable#displayMarkup
     * @function
     * @returns {string}
     */
});

(function () {
    "use strict";

    $oop.addGlobalConstants.call($commonWidgets, /** @lends $commonWidgets */{
        /**
         * Signals that the host has changed to edit mode.
         * @constant
         */
        EVENT_EDITABLE_EDIT_MODE: 'widget.editMode.on',

        /**
         * Signals that the host has changed to display mode.
         * @constant
         */
        EVENT_EDITABLE_DISPLAY_MODE: 'widget.editMode.off'
    });
}());
