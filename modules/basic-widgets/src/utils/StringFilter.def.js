$oop.postpone($basicWidgets, 'StringFilter', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * @name $basicWidgets.StringFilter.create
     * @function
     * @param {function} filter
     * @returns {$basicWidgets.StringFilter}
     */

    /**
     * Filters a string according to a filter function.
     * @class
     * @extends $oop.Base
     */
    $basicWidgets.StringFilter = self
        .addMethods(/** @lends $basicWidgets.StringFilter# */{
            /**
             * @param {function} filterFunction
             * @ignore
             */
            init: function (filterFunction) {
                $assertion.isFunction(filterFunction, "Invalid filter function");

                /**
                 * @type {Function}
                 * @returns {string}
                 */
                this.filterFunction = filterFunction;
            },

            /**
             * @param {string} str
             * @returns {string}
             */
            filter: function (str) {
                return this.filterFunction(str);
            }
        });
});

(function () {
    "use strict";

    $oop.extendBuiltIn(Function.prototype, /** @lends Function# */{
        /**
         * @returns {$basicWidgets.StringFilter}
         */
        toStringFilter: function () {
            return $basicWidgets.StringFilter.create(this.valueOf());
        }
    });
}());
