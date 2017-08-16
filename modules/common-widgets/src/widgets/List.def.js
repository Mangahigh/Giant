$oop.postpone($commonWidgets, 'List', function (ns, className) {
    "use strict";

    var base = $widget.Widget,
        self = base.extend(className);

    /**
     * Creates a List instance.
     * @name $commonWidgets.List.create
     * @function
     * @returns {$commonWidgets.List}
     */

    /**
     * The List is an aggregation of other widgets.
     * By default, it maps to the <em>ul</em> and <em>li</em> HTML elements, but that can be changed by subclassing.
     * Item order follows the normal ordering child widgets, ie. in the order of their names.
     * @class
     * @extends $widget.Widget
     */
    $commonWidgets.List = self
        .addMethods(/** @lends $commonWidgets.List# */{
            /** @ignore */
            init: function () {
                base.init.call(this);
                this.setTagName('ul');
            },

            /**
             * Adds a widget to the list as its item.
             * Changes the specified widget's tag name to 'li'.
             * @param itemWidget
             * @returns {$commonWidgets.List}
             */
            addItemWidget: function (itemWidget) {
                itemWidget
                    .setTagName('li')
                    .addToParent(this);

                return this;
            }
        });
});

(function () {
    "use strict";

    $oop.addGlobalConstants.call($commonWidgets, /** @lends $commonWidgets */{
        /**
         * Signals that the items in a List have changed.
         * @constant
         */
        EVENT_LIST_ITEMS_CHANGE: 'widget.change.items'
    });
}());
