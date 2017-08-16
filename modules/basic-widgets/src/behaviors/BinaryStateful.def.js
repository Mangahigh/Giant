$oop.postpone($basicWidgets, 'BinaryStateful', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * Trait. Manages multiple binary states with multiple contributing sources.
     * @class
     * @extends $oop.Base
     * @extends $widget.Widget
     * @see $basicWidgets.BinaryState
     */
    $basicWidgets.BinaryStateful = self
        .addConstants(/** @lends $basicWidgets.BinaryStateful */{
            /**
             * Identifier for imposed source.
             * @constant
             */
            SOURCE_ID_IMPOSED: 'imposed'
        })
        .addPrivateMethods(/** @lends $basicWidgets.BinaryStateful# */{
            /**
             * Imposes a source on the specified state provided that that state allows cascading.
             * @param {string} stateName
             * @returns {$basicWidgets.BinaryStateful}
             * @private
             */
            _addImposedState: function (stateName) {
                var state = this.getBinaryState(stateName),
                    sourceCountBefore = state.getSourceCount(),
                    sourceCountAfter;

                state.addSource(self.SOURCE_ID_IMPOSED);
                sourceCountAfter = state.getSourceCount();

                if (sourceCountAfter && !sourceCountBefore) {
                    // state just switched to "on"
                    this.afterStateOn(stateName);
                }

                return this;
            },

            /**
             * Removes contributing source imposed by the specified instance from the specified state.
             * @param {string} stateName
             * @returns {$basicWidgets.BinaryStateful}
             * @private
             */
            _removeImposedState: function (stateName) {
                var state = this.getBinaryState(stateName),
                    sourceCountBefore = state.getSourceCount(),
                    sourceCountAfter;

                state.removeSource(self.SOURCE_ID_IMPOSED);
                sourceCountAfter = state.getSourceCount();

                if (!sourceCountAfter && sourceCountBefore) {
                    // state just switched to "off"
                    this.afterStateOff(stateName);
                }

                return this;
            },

            /**
             * Applies sources imposed by parents on the current instance.
             * @param {string} stateName Identifies state to add imposed sources to.
             * @returns {$basicWidgets.BinaryStateful}
             * @private
             */
            _applyImposedState: function (stateName) {
                // querying nearest parent for matching state
                var parent = this.getAncestor(function (statefulInstance) {
                    var binaryStates = statefulInstance.binaryStates;
                    return binaryStates && statefulInstance.getBinaryState(stateName);
                });

                if (parent && parent.isStateOn(stateName)) {
                    this._addImposedState(stateName);
                }

                return this;
            }
        })
        .addMethods(/** @lends $basicWidgets.BinaryStateful# */{
            /** Call from host's init. */
            init: function () {
                /**
                 * Collection of BinaryState instances
                 * representing independent binary states.
                 * @type {$data.Collection}
                 */
                this.binaryStates = $data.Collection.create();
            },

            /** Call from host's .afterAdd */
            afterAdd: function () {
                var that = this;

                this.binaryStates
                    .forEachItem(function (sources, stateName) {
                        // checking whether any of the parents have matching states set
                        var state = that.getBinaryState(stateName);
                        if (state.isCascading) {
                            // only when state is set to cascade on current instance
                            that._applyImposedState(stateName);
                        }

                        // initializing binary state
                        if (that.isStateOn(stateName)) {
                            that.afterStateOn(stateName);
                        } else {
                            that.afterStateOff(stateName);
                        }
                    });
            },

            /** Call from host's .afterRemove */
            afterRemove: function () {
                var that = this;

                // removing all parent imposed sources from all states
                this.binaryStates
                    .forEachItem(function (binaryState, stateName) {
                        binaryState.stateSources
                            // fetching imposed source IDs
                            .filterByPrefix(self.SOURCE_ID_IMPOSED)
                            .getKeysAsHash()
                            .toCollection()

                            // removing them from current stateful instance
                            .passEachItemTo(that.removeBinaryStateSource, that, 1, stateName);
                    });
            },

            /**
             * Adds a state to the instance. A state must be added before it can be manipulated.
             * @param {string} stateName Identifies the state.
             * @param {boolean} [isCascading=false] Whether new state is cascading.
             * @returns {$basicWidgets.BinaryStateful}
             */
            addBinaryState: function (stateName, isCascading) {
                var binaryStateLayers = this.binaryStates;
                if (!binaryStateLayers.getItem(stateName)) {
                    binaryStateLayers.setItem(
                        stateName,
                        stateName.toBinaryState()
                            .setIsCascading(isCascading));
                }
                return this;
            },

            /**
             * @param {string} stateName
             * @returns {$basicWidgets.BinaryState}
             */
            getBinaryState: function (stateName) {
                return this.binaryStates.getItem(stateName);
            },

            /**
             * Determines whether the specified state evaluates to true.
             * @param {string} stateName Identifies state.
             * @returns {boolean}
             */
            isStateOn: function (stateName) {
                return this.binaryStates.getItem(stateName).isStateOn();
            },

            /**
             * Adds the specified contributing source to the specified state.
             * @param {string} stateName Identifies state.
             * @param {string} sourceId Identifies source.
             * @returns {$basicWidgets.BinaryStateful}
             */
            addBinaryStateSource: function (stateName, sourceId) {
                var state = this.getBinaryState(stateName),
                    sourceCountBefore = state.getSourceCount(),
                    sourceCountAfter;

                // adding source to self
                state.addSource(sourceId);
                sourceCountAfter = state.getSourceCount();

                if (sourceCountAfter && !sourceCountBefore) {
                    // state just switched to "on"

                    // adding source to suitable descendants
                    this.getAllDescendants()
                        .filterBySelector(function (/**$basicWidgets.BinaryStateful*/descendant) {
                            var state = descendant.binaryStates && descendant.getBinaryState(stateName);
                            return state && state.isCascading;
                        })
                        .callOnEachItem('_addImposedState', stateName);

                    this.afterStateOn(stateName);
                }

                return this;
            },

            /**
             * Removes the specified source from the specified state.
             * @param {string} stateName Identifies state.
             * @param {string} [sourceId] Identifies source. When omitted, all sources will be
             * removed.
             * @returns {$basicWidgets.BinaryStateful}
             */
            removeBinaryStateSource: function (stateName, sourceId) {
                var state = this.getBinaryState(stateName),
                    sourceCountBefore = state.getSourceCount(),
                    sourceCountAfter;

                // adding source to self
                state.removeSource(sourceId);
                sourceCountAfter = state.getSourceCount();

                if (!sourceCountAfter && sourceCountBefore) {
                    // state just switched to "off"

                    // adding source to suitable descendants
                    this.getAllDescendants()
                        .filterBySelector(function (/**$basicWidgets.BinaryStateful*/descendant) {
                            var state = descendant.binaryStates && descendant.getBinaryState(stateName);
                            return state && state.isCascading;
                        })
                        .callOnEachItem('_removeImposedState', stateName);

                    this.afterStateOff(stateName);
                }

                return this;
            },

            /**
             * Sets cascading flag on the specified state and updates imposed state on the current instance.
             * @param {string} stateName
             * @param {boolean} isCascading
             * @returns {$basicWidgets.BinaryStateful}
             */
            setIsCascading: function (stateName, isCascading) {
                var state = this.getBinaryState(stateName),
                    wasCascading = state.isCascading;

                if (isCascading && !wasCascading) {
                    // applying imposed state
                    this._applyImposedState(stateName);
                } else if (!isCascading && wasCascading) {
                    // removing imposed source from this instance only
                    // (descendants might still be cascading)
                    this._removeImposedState(stateName);
                }

                state.setIsCascading(isCascading);

                return this;
            }
        });

    /**
     * Called after the state value changes from off to on.
     * @name $basicWidgets.BinaryStateful#afterStateOn
     * @function
     * @param {string} stateName
     */

    /**
     * Called after the state value changes from on to off.
     * @name $basicWidgets.BinaryStateful#afterStateOff
     * @function
     * @param {string} stateName
     */
});
