$oop.postpone($basicWidgets, 'BinaryState', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * @name $basicWidgets.BinaryState.create
     * @function
     * @param {string} stateName Identifies the binary state.
     * @returns {$basicWidgets.BinaryState}
     */

    /**
     * Implements a named state that can be either on or off,
     * depending on the number of sources contributing the state.
     * The state is off when no source contributes the state, on otherwise.
     * @class
     * @extends $oop.Base
     */
    $basicWidgets.BinaryState = self
        .addMethods(/** @lends $basicWidgets.BinaryState# */{
            /**
             * @param {string} stateName
             * @ignore
             */
            init: function (stateName) {
                $assertion.isString(stateName, "Invalid state name");

                /**
                 * Name of the state.
                 * @type {string}
                 */
                this.stateName = stateName;

                /**
                 * Lookup of source identifiers contributing the state.
                 * @type {$data.Collection}
                 */
                this.stateSources = $data.Collection.create();

                /**
                 * Marks the state as cascading, ie. whether it may be influenced externally.
                 * @type {boolean}
                 */
                this.isCascading = false;
            },

            /**
             * @param {boolean} isCascading
             * @returns {$basicWidgets.BinaryState}
             */
            setIsCascading: function (isCascading) {
                this.isCascading = isCascading;
                return this;
            },

            /**
             * Adds the specified source to the state as contributor.
             * @param {string} sourceId Identifies the contributing source.
             * @returns {$basicWidgets.BinaryState}
             */
            addSource: function (sourceId) {
                this.stateSources.setItem(sourceId, true);
                return this;
            },

            /**
             * Removes the specified source from contributors.
             * @param {string} [sourceId] Identifies the contributing source.
             * @returns {$basicWidgets.BinaryState}
             */
            removeSource: function (sourceId) {
                if (typeof sourceId === 'string') {
                    this.stateSources.deleteItem(sourceId);
                } else {
                    this.stateSources.clear();
                }
                return this;
            },

            /**
             * Tells whether the specified state contributes to the state.
             * @param {string} sourceId
             * @returns {boolean}
             */
            hasSource: function (sourceId) {
                return this.stateSources.getItem(sourceId);
            },

            /**
             * Retrieves the identifiers of all contributing sources.
             * @returns {string[]}
             */
            getSourceIds: function () {
                return this.stateSources.getKeys();
            },

            /**
             * Determines the number of contributing sources.
             * @returns {number}
             */
            getSourceCount: function () {
                return this.stateSources.getKeyCount();
            },

            /**
             * Determines whether the state value is true, ie. there is at leas one source
             * contributing.
             * @returns {boolean}
             */
            isStateOn: function () {
                return this.stateSources.getKeyCount() > 0;
            }
        });
});

(function () {
    "use strict";

    $assertion.addTypes(/** @lends $basicWidgets */{
        /** @param {$basicWidgets.BinaryState} expr */
        isBinaryState: function (expr) {
            return $basicWidgets.BinaryState.isBaseOf(expr);
        },

        /** @param {$basicWidgets.BinaryState} [expr] */
        isBinaryStateOptional: function (expr) {
            return typeof expr === 'undefined' ||
                $basicWidgets.BinaryState.isBaseOf(expr);
        }
    });

    $oop.extendBuiltIn(String.prototype, /** @lends String# */{
        /**
         * @returns {$basicWidgets.BinaryState}
         */
        toBinaryState: function () {
            return $basicWidgets.BinaryState.create(this.valueOf());
        }
    });
}());
