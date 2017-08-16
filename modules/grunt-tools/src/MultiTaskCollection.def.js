$oop.postpone($gruntTools, 'MultiTaskCollection', function () {
    "use strict";

    var base = $data.Collection.of($gruntTools.MultiTask),
        self = base.extend();

    /**
     * Creates a MultiTaskCollection instance.
     * MultiTaskCollection instances may also be created via conversion from Array and Hash.
     * (In fact those are favorable to .create().)
     * @name $gruntTools.MultiTaskCollection.create
     * @function
     * @param {Object|Array} items
     * @returns {$gruntTools.MultiTaskCollection}
     * @see Array#toMultiTaskCollection
     * @see $data.Hash#toMultiTaskCollection
     */

    /**
     * The MultiTaskCollection class implements a typed collection for storing and managing
     * MultiTask instances. The main purpose of MultiTaskCollection is to provide conversion to
     * config-related objects and classes.
     * @class
     * @extends $data.Collection
     * @extends $gruntTools.MultiTask
     */
    $gruntTools.MultiTaskCollection = self
        .addMethods(/** @lends $gruntTools.MultiTaskCollection# */{
            /**
             * Generates a grunt config object for all tasks in the collection,
             * with targets optionally prefixed.
             * @param {string} [targetPrefix] Optional prefix for all targets of all tasks.
             * @returns {Object|Array}
             */
            getConfigNode: function (targetPrefix) {
                return this.callOnEachItem('getConfigNode', targetPrefix).items;
            },

            /**
             * Converts task collection to a GruntConfig instance.
             * @param {string} [targetPrefix] Optional prefix for all targets of all tasks.
             * @returns {$gruntTools.GruntConfig}
             */
            toGruntConfig: function (targetPrefix) {
                return $gruntTools.GruntConfig.create(this.getConfigNode(targetPrefix));
            }
        });
});

$oop.amendPostponed($data, 'Hash', function () {
    "use strict";

    $data.Hash.addMethods(/** @lends $data.Hash# */{
        /**
         * Converts Hash to MultiTaskCollection. Hash items must be MultiTask instances.
         * @returns {$gruntTools.MultiTaskCollection}
         */
        toMultiTaskCollection: function () {
            return $gruntTools.MultiTaskCollection.create(this.items);
        }
    });
});

(function () {
    "use strict";

    $oop.extendBuiltIn(Array.prototype, /** @lends Array# */{
        /**
         * Converts Array to MultiTaskCollection. Array items must be MultiTask instances.
         * @returns {$gruntTools.MultiTaskCollection}
         */
        toMultiTaskCollection: function () {
            return $gruntTools.MultiTaskCollection.create(this);
        }
    });

    $assertion.addTypes(/** @lends $gruntTools */{
        /** @param {$gruntTools.MultiTaskCollection} expr */
        isMultiTaskCollection: function (expr) {
            return $gruntTools.MultiTaskCollection.isBaseOf(expr);
        },

        /** @param {$gruntTools.MultiTaskCollection} expr */
        isMultiTaskCollectionOptional: function (expr) {
            return typeof expr === 'undefined' ||
                $gruntTools.MultiTaskCollection.isBaseOf(expr);
        }
    });
}());
