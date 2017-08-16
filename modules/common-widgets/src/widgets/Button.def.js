$oop.postpone($commonWidgets, 'Button', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = $widget.Widget,
        self = base.extend(className)
            .addTraitAndExtend($commonWidgets.BinaryStateful)
            .addTrait($commonWidgets.Disableable);

    /**
     * Creates a Button instance.
     * @name $commonWidgets.Button.create
     * @function
     * @returns {$commonWidgets.Button}
     */

    /**
     * General purpose button widget.
     * Supports disabling and click events.
     * @class
     * @extends $widget.Widget
     * @extends $commonWidgets.BinaryStateful
     * @extends $commonWidgets.Disableable
     */
    $commonWidgets.Button = self
        .addMethods(/** @lends $commonWidgets.Button# */{
            /** @ignore */
            init: function () {
                base.init.call(this);
                $commonWidgets.BinaryStateful.init.call(this);
                $commonWidgets.Disableable.init.call(this);

                this.elevateMethod('onClick');
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                $commonWidgets.BinaryStateful.afterAdd.call(this);
            },

            /** @ignore */
            afterRender: function () {
                base.afterRender.call(this);
                $(this.getElement())
                    .on('click', this.onClick);
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                $commonWidgets.BinaryStateful.afterRemove.call(this);
            },

            /**
             * Clicks the button.
             * @returns {$commonWidgets.Button}
             */
            clickButton: function () {
                if (!this.isDisabled()) {
                    this.triggerSync($commonWidgets.EVENT_BUTTON_CLICK);
                }
                return this;
            },

            /**
             * @param {jQuery.Event} event
             * @ignore */
            onClick: function (event) {
                var link = $event.pushOriginalEvent(event);
                this.clickButton();
                link.unlink();
            }
        });
}, jQuery);

(function () {
    "use strict";

    $oop.addGlobalConstants.call($commonWidgets, /** @lends $commonWidgets */{
        /**
         * Signals that a Button was clicked.
         * @constants
         */
        EVENT_BUTTON_CLICK: 'widget.click.button'
    });
}());
