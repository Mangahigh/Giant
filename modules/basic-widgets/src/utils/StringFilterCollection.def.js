$oop.postpone($basicWidgets, 'StringFilterCollection', function () {
    "use strict";

    var base = $data.Collection.of($basicWidgets.StringFilter),
        self = base.extend();

    /**
     * @name $basicWidgets.StringFilter.create
     * @function
     * @param {object} filters
     * @returns {$basicWidgets.StringFilter}
     */

    /**
     *
     * @class
     * @extends $data.Collection
     * @extends $basicWidgets.StringFilter
     */
    $basicWidgets.StringFilterCollection = self
        .addMethods(/** @lends $basicWidgets.StringFilterCollection# */{
            /**
             * @param {string} str
             * @returns {string}
             */
            filter: function (str) {
                return this
                    // formatting string in order of filter IDs
                    .getSortedValues()
                    .reduce(function (originalString, stringFilter) {
                        return stringFilter.filter(originalString);
                    }, str);
            }
        });
});
