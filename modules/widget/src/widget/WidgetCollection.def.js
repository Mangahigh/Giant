$oop.postpone($widget, 'WidgetCollection', function () {
    "use strict";

    var base = $data.Collection.of($widget.Widget),
        self = base.extend();

    /**
     * Creates a WidgetCollection instance.
     * @name $widget.WidgetCollection.create
     * @function
     * @param {object} [items]
     * @returns {$widget.WidgetCollection}
     */

    /**
     * The WidgetCollection is a specified collection merging the Collection API with the Widget API.
     * Also allows serialization of all widgets in the collection into a single string.
     * @class
     * @extends $data.Collection
     * @extends $widget.Widget
     */
    $widget.WidgetCollection = self
        .addMethods(/** @lends $widget.WidgetCollection# */{
            /**
             * Generates the markup for all widgets in the collection, in the order of their names.
             * @returns {string}
             */
            toString: function () {
                return this.callOnEachItem('toString')
                    .getSortedValues()
                    .join('');
            },

            /**
             * Generates the markup for all widgets in the collection, in the order provided by the childOrder.
             * @param {string[]} [childOrder]
             * @returns {string}
             */
            toSortedString: function (childOrder) {
                if (childOrder) {
                    return this.callOnEachItem('toString')
                        .getSortedValues(function (a, b) {
                            var indexA = childOrder.indexOf(a),
                                indexB = childOrder.indexOf(b);

                            if (indexA === -1 && indexB === -1) {
                                // neither in childOrder - sort by name
                                return (a === b ? 0 : (a > b ? 1 : -1));
                            } else if (indexA === -1) {
                                // B in childOrder
                                return 1;
                            } else if (indexB === -1) {
                                // A in childOrder
                                return -1;
                            } else {
                                // both in childOrder
                                return (indexA === indexB ? 0 : (indexA > indexB ? 1 : -1));
                            }
                        })
                        .join('');
                } else {
                    return this.toString();
                }
            }
        });
});

$oop.amendPostponed($data, 'Hash', function () {
    "use strict";

    $data.Hash
        .addMethods(/** @lends $data.Hash# */{
            /**
             * Converts `Hash` to `WidgetCollection`.
             * @returns {$widget.WidgetCollection}
             */
            toWidgetCollection: function () {
                return $widget.WidgetCollection.create(this.items);
            }
        });
});

(function () {
    "use strict";

    $oop.extendBuiltIn(Array.prototype, /** @lends Array# */{
        /**
         * Converts array of `Widget` instances to a `WidgetCollection`.
         * @returns {$widget.WidgetCollection}
         */
        toWidgetCollection: function () {
            return $widget.WidgetCollection.create(this);
        }
    });
}());
