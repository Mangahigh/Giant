$oop.postpone($basicWidgets, 'Button', function (ns, cn) {
    "use strict";

    var base = $widget.Widget,
        self = base.extend(cn)
            .addTraitAndExtend($basicWidgets.BinaryStateful)
            .addTrait($basicWidgets.Disableable, 'Disableable')
            .addTraitAndExtend($basicWidgets.Clickable, 'Clickable')
            .addTraitAndExtend($basicWidgets.DomFocusable, 'DomFocusable')
            .addTraitAndExtend($basicWidgets.DomInputable, 'DomInputable')
            .addTraitAndExtend($basicWidgets.DomValuable, 'DomValuable');

    /**
     * Creates a Button instance.
     * @name $basicWidgets.Button.create
     * @function
     * @returns {$basicWidgets.Button}
     */

    /**
     * @class
     * @extends $widget.Widget
     * @extends $basicWidgets.BinaryStateful
     * @extends $basicWidgets.Disableable
     * @extends $basicWidgets.Clickable
     * @extends $basicWidgets.DomFocusable
     * @extends $basicWidgets.DomInputable
     * @extends $basicWidgets.DomValuable
     */
    $basicWidgets.Button = self
        .addMethods(/** @lends $basicWidgets.Button# */{
            /** @ignore */
            init: function () {
                base.init.call(this);
                $basicWidgets.BinaryStateful.init.call(this);
                $basicWidgets.Disableable.init.call(this);
                $basicWidgets.Clickable.init.call(this);
                $basicWidgets.DomFocusable.init.call(this);
                $basicWidgets.DomValuable.init.call(this);

                this.setTagName('button');
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                $basicWidgets.BinaryStateful.afterAdd.call(this);
                $basicWidgets.DomInputable.afterAdd.call(this);
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
                $basicWidgets.DomFocusable.afterRender.call(this);
                $basicWidgets.DomValuable.afterRender.call(this);
            },

            /** Call from host's .afterStateOn */
            afterStateOn: function (stateName) {
                $basicWidgets.Disableable.afterStateOn.call(this, stateName);
                $basicWidgets.DomInputable.afterStateOn.call(this, stateName);
            },

            /** Call from host's .afterStateOff */
            afterStateOff: function (stateName) {
                $basicWidgets.Disableable.afterStateOff.call(this, stateName);
                $basicWidgets.DomInputable.afterStateOff.call(this, stateName);
            },

            /**
             * Overrides Clickable's click to take disabled state into account.
             * @returns {$basicWidgets.Button}
             */
            click: function () {
                if (!this.isDisabled()) {
                    $basicWidgets.Clickable.click.call(this);
                }
                return this;
            }
        });
});
