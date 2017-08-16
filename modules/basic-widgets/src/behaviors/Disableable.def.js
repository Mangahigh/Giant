$oop.postpone($basicWidgets, 'Disableable', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * Endows Widget classes with an enabled - disabled state.
     * A Disableable may be disabled by multiple sources. All such sources have to
     * re-enable the host to be fully enabled again.
     * Expects to be added to Widget instances.
     * Expects the host to have the BinaryStateful trait applied.
     * @class
     * @extends $oop.Base
     * @extends $basicWidgets.BinaryStateful
     * @extends $widget.Widget
     */
    $basicWidgets.Disableable = self
        .addConstants(/** @lends $basicWidgets.Disableable */{
            /** @constant */
            STATE_NAME_DISABLED: 'state-disabled'
        })
        .addPrivateMethods(/** @lends $basicWidgets.Disableable# */{
            /** @private */
            _updateEnabledStyle: function () {
                if (this.isDisabled()) {
                    this.removeCssClass('widget-enabled')
                        .addCssClass('widget-disabled');
                } else {
                    this.removeCssClass('widget-disabled')
                        .addCssClass('widget-enabled');
                }
            }
        })
        .addMethods(/** @lends $basicWidgets.Disableable# */{
            /** Call from host's .init. */
            init: function () {
                // disableable state is cascading
                this.addBinaryState(self.STATE_NAME_DISABLED, true);
            },

            /** Call from host's .afterStateOn */
            afterStateOn: function (stateName) {
                if (stateName === self.STATE_NAME_DISABLED) {
                    this._updateEnabledStyle();
                }
            },

            /** Call from host's .afterStateOff */
            afterStateOff: function (stateName) {
                if (stateName === self.STATE_NAME_DISABLED) {
                    this._updateEnabledStyle();
                }
            },

            /**
             * Disables the instance by the specified source.
             * @param {string} disablingSource
             * @returns {$basicWidgets.Disableable}
             */
            disableBy: function (disablingSource) {
                this.addBinaryStateSource(self.STATE_NAME_DISABLED, disablingSource);
                return this;
            },

            /**
             * Enables the instance by the specified source.
             * @param {string} disablingSource
             * @returns {$basicWidgets.Disableable}
             */
            enableBy: function (disablingSource) {
                this.removeBinaryStateSource(self.STATE_NAME_DISABLED, disablingSource);
                return this;
            },

            /**
             * Releases all disabling sources at once.
             * @returns {$basicWidgets.Disableable}
             */
            forceEnable: function () {
                this.removeBinaryStateSource(self.STATE_NAME_DISABLED);
                return this;
            },

            /**
             * Tells whether the current instance is currently disabled.
             * @returns {boolean}
             */
            isDisabled: function () {
                return this.isStateOn(self.STATE_NAME_DISABLED);
            }
        });
});
