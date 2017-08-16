$oop.postpone($basicWidgets, 'ClickArea', function (ns, cn) {
    "use strict";

    var base = $widget.Widget,
        self = base.extend(cn)
            .addTraitAndExtend($basicWidgets.BinaryStateful)
            .addTrait($basicWidgets.Disableable, 'Disableable')
            .addTraitAndExtend($basicWidgets.Clickable, 'Clickable');

    /**
     * Creates a ClickArea instance.
     * @name $basicWidgets.ClickArea.create
     * @function
     * @returns {$basicWidgets.ClickArea}
     */

    /**
     * Implements an area or container that can be clicked.
     * Typically used as a button.
     * Supports disabling and click events.
     * @class
     * @extends $widget.Widget
     * @extends $basicWidgets.BinaryStateful
     * @extends $basicWidgets.Disableable
     * @extends $basicWidgets.Clickable
     */
    $basicWidgets.ClickArea = self
        .addMethods(/** @lends $basicWidgets.ClickArea# */{
            /** @ignore */
            init: function () {
                base.init.call(this);
                $basicWidgets.BinaryStateful.init.call(this);
                $basicWidgets.Disableable.init.call(this);
                $basicWidgets.Clickable.init.call(this);
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                $basicWidgets.BinaryStateful.afterAdd.call(this);
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                $basicWidgets.BinaryStateful.afterRemove.call(this);
            },

            /** @ignore */
            afterRender: function () {
                base.afterRender.call(this);
                $basicWidgets.Clickable.afterRender.call(this);
            },

            /**
             * Overrides Clickable's click to take disabled state into account.
             * @returns {$basicWidgets.ClickArea}
             */
            click: function () {
                if (!this.isDisabled()) {
                    $basicWidgets.Clickable.click.call(this);
                }
                return this;
            }
        });
});
