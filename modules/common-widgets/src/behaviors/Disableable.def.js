$oop.postpone($commonWidgets, 'Disableable', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * The Disableable trait endows Widget classes with an enabled - disabled state.
     * A Disableable may be disabled by multiple sources. All such sources have to
     * re-enable the host to be fully enabled again.
     * Expects to be added to Widget instances.
     * Expects the host to have the BinaryStateful trait applied.
     * @class
     * @extends $oop.Base
     * @extends $commonWidgets.BinaryStateful
     * @extends $widget.Widget
     */
    $commonWidgets.Disableable = self
        .addConstants(/** @lends $commonWidgets.Disableable */{
            /** @constant */
            STATE_NAME_DISABLEBABLE: 'state-disableable'
        })
        .addPrivateMethods(/** @lends $commonWidgets.Disableable# */{
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
        .addMethods(/** @lends $commonWidgets.Disableable# */{
            /** Call from host's .init. */
            init: function () {
                // disableable state is cascading
                this.addBinaryState(self.STATE_NAME_DISABLEBABLE, true);
            },

            /** Call from host's .afterStateOn */
            afterStateOn: function (stateName) {
                if (stateName === self.STATE_NAME_DISABLEBABLE) {
                    this._updateEnabledStyle();
                }
            },

            /** Call from host's .afterStateOff */
            afterStateOff: function (stateName) {
                if (stateName === self.STATE_NAME_DISABLEBABLE) {
                    this._updateEnabledStyle();
                }
            },

            /**
             * Disables the instance by the specified source.
             * @param {string} disablingSource
             * @returns {$commonWidgets.Disableable}
             */
            disableBy: function (disablingSource) {
                this.addBinaryStateSource(self.STATE_NAME_DISABLEBABLE, disablingSource);
                return this;
            },

            /**
             * Enables the instance by the specified source.
             * @param {string} disablingSource
             * @returns {$commonWidgets.Disableable}
             */
            enableBy: function (disablingSource) {
                this.removeBinaryStateSource(self.STATE_NAME_DISABLEBABLE, disablingSource);
                return this;
            },

            /**
             * Releases all disabling sources at once.
             * @returns {$commonWidgets.Disableable}
             */
            forceEnable: function () {
                this.removeBinaryStateSource(self.STATE_NAME_DISABLEBABLE);
                return this;
            },

            /**
             * Tells whether the current instance is currently disabled.
             * @returns {boolean}
             */
            isDisabled: function () {
                return this.isStateOn(self.STATE_NAME_DISABLEBABLE);
            }
        });
});
