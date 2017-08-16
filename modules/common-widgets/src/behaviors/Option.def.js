$oop.postpone($commonWidgets, 'Option', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * The Option trait allows widgets to behave like option items in a dropdown or select list.
     * Add this trait to classes aimed to be used as options in a dropdown.
     * Expects host to have the Highlightable trait.
     * @class
     * @extends $oop.Base
     * @extends $widget.Widget
     * @extends $commonWidgets.BinaryStateful
     * @extends $commonWidgets.Highlightable
     */
    $commonWidgets.Option = self
        .addConstants(/** @lends $commonWidgets.Option */{
            /** @constant */
            HIGHLIGHTED_FOCUS: 'highlighted-focus',

            /** @constant */
            HIGHLIGHTED_ACTIVE: 'highlighted-active'
        })
        .addMethods(/** @lends $commonWidgets.Option# */{
            /**
             * Call from host's init.
             * @param {*} [optionValue]
             */
            init: function (optionValue) {
                this
                    .elevateMethod('onOptionClick')
                    .elevateMethod('onOptionHover');

                /**
                 * Value carried by option.
                 * This is not what's displayed in the option, but the logical value associated with it.
                 * This is the value that will be passed back along the event when the option is selected.
                 * @type {*}
                 */
                this.optionValue = optionValue;
            },

            /** Call from host's afterRender. */
            afterRender: function () {
                var element = this.getElement();
                if (element) {
                    $(element)
                        .on('click', this.onOptionClick)
                        .on('mouseenter', this.onOptionHover);
                }
            },

            /**
             * Sets option value.
             * @param {*} optionValue
             * @returns {$commonWidgets.Option}
             */
            setOptionValue: function (optionValue) {
                this.optionValue = optionValue;
                return this;
            },

            /**
             * Marks current option as focused.
             * @returns {$commonWidgets.Option}
             */
            markAsFocused: function () {
                if (!this.isFocused()) {
                    this.highlightOn(self.HIGHLIGHTED_FOCUS)
                        .spawnEvent($commonWidgets.EVENT_OPTION_FOCUS)
                        .setPayloadItems({
                            optionName : this.childName,
                            optionValue: this.optionValue
                        })
                        .triggerSync();
                }
                return this;
            },

            /**
             * Marks current option as no longer focused.
             * @returns {$commonWidgets.Option}
             */
            markAsBlurred: function () {
                if (this.isFocused()) {
                    this.highlightOff(self.HIGHLIGHTED_FOCUS)
                        .spawnEvent($commonWidgets.EVENT_OPTION_BLUR)
                        .setPayloadItems({
                            optionName : this.childName,
                            optionValue: this.optionValue
                        })
                        .triggerSync();
                }
                return this;
            },

            /**
             * Tells whether the current option is focused.
             * @returns {boolean}
             */
            isFocused: function () {
                return this.isHighlighted(self.HIGHLIGHTED_FOCUS);
            },

            /**
             * Marks current option as active.
             * @returns {$commonWidgets.Option}
             */
            markAsActive: function () {
                if (!this.isActive()) {
                    this.highlightOn(self.HIGHLIGHTED_ACTIVE)
                        .spawnEvent($commonWidgets.EVENT_OPTION_ACTIVE)
                        .setPayloadItems({
                            optionName : this.childName,
                            optionValue: this.optionValue
                        })
                        .triggerSync();
                }
                return this;
            },

            /**
             * Marks current option as inactive.
             * @returns {$commonWidgets.Option}
             */
            markAsInactive: function () {
                if (this.isActive()) {
                    this.highlightOff(self.HIGHLIGHTED_ACTIVE)
                        .spawnEvent($commonWidgets.EVENT_OPTION_INACTIVE)
                        .setPayloadItems({
                            optionName : this.childName,
                            optionValue: this.optionValue
                        })
                        .triggerSync();
                }
                return this;
            },

            /**
             * Tells whether the current option is active.
             * @returns {boolean}
             */
            isActive: function () {
                return this.isHighlighted(self.HIGHLIGHTED_ACTIVE);
            },

            /**
             * @param {jQuery.Event} event
             * @ignore
             */
            onOptionClick: function (event) {
                var link = $event.pushOriginalEvent(event);
                this.markAsActive();
                link.unlink();
            },

            /**
             * @param {jQuery.Event} event
             * @ignore
             */
            onOptionHover: function (event) {
                var link = $event.pushOriginalEvent(event);
                this.markAsFocused();
                link.unlink();
            }
        });
}, jQuery);

(function () {
    "use strict";

    $oop.addGlobalConstants.call($commonWidgets, /** @lends $commonWidgets */{
        /**
         * Signals that an Option has gained focus.
         * @constant
         */
        EVENT_OPTION_FOCUS: 'widget.focus.on.option',

        /**
         * Signals that an Option has lost focus.
         * @constant
         */
        EVENT_OPTION_BLUR: 'widget.focus.off.option',

        /**
         * Signals that an Option became active.
         * @constant
         */
        EVENT_OPTION_ACTIVE: 'widget.active.on.option',

        /**
         * Signals that an Option became inactive.
         * @constant
         */
        EVENT_OPTION_INACTIVE: 'widget.active.off.option'
    });
}());
