$oop.postpone($gruntTools, 'GruntTaskCollection', function () {
    "use strict";

    /**
     * Creates a GruntTaskCollection instance.
     * GruntTaskCollection instances may also be created via conversion from Array and Hash.
     * (In fact those are favorable to .create().)
     * @name $gruntTools.GruntTaskCollection.create
     * @function
     * @param {Object|Array} items
     * @returns {$gruntTools.GruntTaskCollection}
     * @see Array#toGruntTaskCollection
     * @see $data.Hash#toGruntTaskCollection
     */

    /**
     * The GruntTaskCollection class implements a typed collection for storing and managing
     * GruntTask instances.
     * @class
     * @extends $data.Collection
     * @extends $gruntTools.GruntTask
     */
    $gruntTools.GruntTaskCollection = $data.Collection.of($gruntTools.GruntTask);
});

$oop.amendPostponed($data, 'Hash', function () {
    "use strict";

    $data.Hash.addMethods(/** @lends $data.Hash# */{
        /**
         * Converts Hash to GruntTaskCollection. Hash items must be GruntTask instances.
         * @returns {$gruntTools.GruntTaskCollection}
         */
        toGruntTaskCollection: function () {
            return $gruntTools.GruntTaskCollection.create(this.items);
        }
    });
});

(function () {
    "use strict";

    $oop.extendBuiltIn(Array.prototype, /** @lends Array# */{
        /**
         * Converts Array to GruntTaskCollection. Array items must be GruntTask instances.
         * @returns {$gruntTools.GruntTaskCollection}
         */
        toGruntTaskCollection: function () {
            return $gruntTools.GruntTaskCollection.create(this);
        }
    });

    $assertion.addTypes(/** @lends $gruntTools */{
        /** @param {$gruntTools.GruntTaskCollection} expr */
        isGruntTaskCollection: function (expr) {
            return $gruntTools.GruntTaskCollection.isBaseOf(expr);
        },

        /** @param {$gruntTools.GruntTaskCollection} expr */
        isGruntTaskCollectionOptional: function (expr) {
            return typeof expr === 'undefined' ||
                $gruntTools.GruntTaskCollection.isBaseOf(expr);
        }
    });
}());
