$oop.postpone($commonWidgets, 'Highlightable', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * The Highlightable trait adds switchable highlight to widgets.
     * Expects to be added to Widget instances.
     * Expects the host to have the BinaryStateful trait applied.
     * Overrides BinaryStateful's methods, must be added *after* BinaryStateful, and on a different
     * prototype level (using addTraitAndExtend()).
     * @class
     * @extends $oop.Base
     * @extends $commonWidgets.BinaryStateful
     * @extends $widget.Widget
     */
    $commonWidgets.Highlightable = self
        .addConstants(/** @lends $commonWidgets.Highlightable */{
            /** @constant */
            STATE_NAME_HIGHLIGHTABLE: 'state-highlightable'
        })
        .addPrivateMethods(/** @lends $commonWidgets.Highlightable# */{
            /**
             * TODO: Refactor to use Set.
             * @private
             */
            _updateHighlightedState: function () {
                // removing all previous highlights
                this.highlightIds
                    .passEachItemTo(this.removeCssClass, this);

                var highlightIds = this.getBinaryState(self.STATE_NAME_HIGHLIGHTABLE)
                    .getSourceIds()
                    .toCollection();

                // adding current highlights
                highlightIds.passEachItemTo(this.addCssClass, this);

                this.highlightIds = highlightIds;
            }
        })
        .addMethods(/** @lends $commonWidgets.Highlightable# */{
            /** Call from host's init. */
            init: function () {
                // highlightable state does not cascade
                this.addBinaryState(self.STATE_NAME_HIGHLIGHTABLE);

                /**
                 * Lookup of highlight identifiers currently assigned to the instance.
                 * @type {$data.Collection}
                 */
                this.highlightIds = $data.Collection.create();
            },

            /**
             * @param {string} stateName
             * @param {string} sourceId
             * @returns {$commonWidgets.Highlightable}
             */
            addBinaryStateSource: function (stateName, sourceId) {
                $commonWidgets.BinaryStateful.addBinaryStateSource.call(this, stateName, sourceId);
                if (stateName === self.STATE_NAME_HIGHLIGHTABLE) {
                    this._updateHighlightedState();
                }
                return this;
            },

            /**
             * @param {string} stateName
             * @returns {$commonWidgets.Highlightable}
             */
            addImposedStateSource: function (stateName) {
                $commonWidgets.BinaryStateful.addImposedStateSource.call(this, stateName);
                if (stateName === self.STATE_NAME_HIGHLIGHTABLE) {
                    this._updateHighlightedState();
                }
                return this;
            },

            /**
             * @param {string} stateName
             * @param {string} sourceId
             * @returns {$commonWidgets.Highlightable}
             */
            removeBinaryStateSource: function (stateName, sourceId) {
                $commonWidgets.BinaryStateful.removeBinaryStateSource.call(this, stateName, sourceId);
                if (stateName === self.STATE_NAME_HIGHLIGHTABLE) {
                    this._updateHighlightedState();
                }
                return this;
            },

            /**
             * @param {string} stateName
             * @returns {$commonWidgets.Highlightable}
             */
            removeImposedStateSource: function (stateName) {
                $commonWidgets.BinaryStateful.removeImposedStateSource.call(this, stateName);
                if (stateName === self.STATE_NAME_HIGHLIGHTABLE) {
                    this._updateHighlightedState();
                }
                return this;
            },

            /**
             * Dummy handler.
             * @param {string} stateName
             */
            afterStateOn: function (stateName) {
            },

            /**
             * Dummy handler.
             * @param {string} stateName
             */
            afterStateOff: function (stateName) {
            },

            /**
             * Marks widget as highlighted.
             * @param {string} [highlightId]
             * @returns {$commonWidgets.Highlightable}
             */
            highlightOn: function (highlightId) {
                $assertion.isStringOptional(highlightId, "Invalid highlight ID");
                this.addBinaryStateSource(
                    self.STATE_NAME_HIGHLIGHTABLE,
                    highlightId || 'highlighted');
                return this;
            },

            /**
             * Marks widget as non-highlighted.
             * @param {string} [highlightId]
             * @returns {$commonWidgets.Highlightable}
             */
            highlightOff: function (highlightId) {
                $assertion.isStringOptional(highlightId, "Invalid highlight ID");
                this.removeBinaryStateSource(
                    self.STATE_NAME_HIGHLIGHTABLE,
                    highlightId || 'highlighted');
                return this;
            },

            /**
             * Tells whether the widget is currently highlighted.
             * @param {string} [highlightId]
             * @returns {boolean}
             */
            isHighlighted: function (highlightId) {
                $assertion.isStringOptional(highlightId, "Invalid highlight ID");
                return highlightId ?
                       this.getBinaryState(self.STATE_NAME_HIGHLIGHTABLE)
                           .hasSource(highlightId) :
                       this.isStateOn(self.STATE_NAME_HIGHLIGHTABLE);
            }
        });
});
