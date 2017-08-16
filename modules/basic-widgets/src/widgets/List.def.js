$oop.postpone($basicWidgets, 'List', function (ns, cn) {
    "use strict";

    var base = $widget.Widget,
        self = base.extend(cn);

    /**
     * @name $basicWidgets.List.create
     * @function
     * @returns {$basicWidgets.List}
     */

    /**
     * Aggregates widgets. Item order is determined by items' childName properties.
     * @class
     * @extends $widget.Widget
     */
    $basicWidgets.List = self
        .addPrivateMethods(/** @lends $basicWidgets.List# */{
            /**
             * @param {$widget.Widget} itemWidget
             * @private
             */
            _checkListItemTagName: function (itemWidget) {
                var itemTagName = itemWidget.tagName;

                switch (this.tagName) {
                case 'ul':
                case 'ol':
                    return itemTagName === 'li';

                case 'dl':
                    return itemTagName === 'dt' ||
                        itemTagName === 'dd';

                default:
                    return true;
                }
            }
        })
        .addMethods(/** @lends $basicWidgets.List# */{
            /** @ignore */
            init: function () {
                base.init.call(this);
                this.setTagName('ul');
            },

            /**
             * Adds item to list.
             * @param {$widget.Widget} itemWidget
             * @returns {$basicWidgets.List}
             */
            addItemWidget: function (itemWidget) {
                $assertion.assert(this._checkListItemTagName(itemWidget),
                    "Invalid item tag name");

                itemWidget.addToParent(this);

                return this;
            },

            /**
             * Removes specified item from list.
             * @param {$widget.Widget} itemWidget
             * @returns {$basicWidgets.List}
             */
            removeItemWidget: function (itemWidget) {
                $assertion.assert(
                    this.getChild(itemWidget.childName) === itemWidget,
                    "Item widget is not in list");

                itemWidget.removeFromParent();

                return this;
            }
        });
});
