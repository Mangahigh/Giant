$oop.postpone($commonWidgets, 'Dropdown', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = $widget.Widget,
        self = base.extend(className)
            .addTraitAndExtend($commonWidgets.AlignedPopup, 'Popup');

    /**
     * Creates a Dropdown instance.
     * @name $commonWidgets.Dropdown.create
     * @function
     * @returns {$commonWidgets.Dropdown}
     */

    /**
     * The Dropdown is a navigable list wrapped inside a popup.
     * The internal list can be of any List-based class, however, the Dropdown will only function properly
     * when the internal list has the OptionList trait, and its items have the Option trait.
     * The dropdown aligns to its parent widget's DOM using the settings provided via AlignedPopup.
     * By default, it will align its top left corner to the parent's bottom left corner.
     * The Dropdown controls scrolling of the internal list.
     * @class
     * @extends $widget.Widget
     * @extends $commonWidgets.AlignedPopup
     */
    $commonWidgets.Dropdown = self
        .addMethods(/** @lends $commonWidgets.Dropdown# */{
            /** @ignore */
            init: function () {
                base.init.call(this);
                $commonWidgets.AlignedPopup.init.call(this);

                this
                    .elevateMethod('onOptionFocus')
                    .elevateMethod('onOptionSelect')
                    .elevateMethod('onOptionsEscape');

                this.spawnListWidget()
                    .setChildName('options-list')
                    .addToParent(this);
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                $commonWidgets.AlignedPopup.afterAdd.call(this);

                this
                    .subscribeTo($commonWidgets.EVENT_OPTION_FOCUS, this.onOptionFocus)
                    .subscribeTo($commonWidgets.EVENT_OPTION_SELECT, this.onOptionSelect)
                    .subscribeTo($commonWidgets.EVENT_OPTIONS_ESCAPE, this.onOptionsEscape);
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                $commonWidgets.AlignedPopup.afterRemove.call(this);
            },

            /** @ignore */
            afterRender: function () {
                base.afterRender.call(this);
                $commonWidgets.AlignedPopup.afterRender.call(this);
            },

            /**
             * Creates the internal list widget.
             * Override this method to specify other List-based widgets to use.
             * Ones that have the OptionList trait, and its items have the Option trait, are the best.
             * @returns {$commonWidgets.List}
             */
            spawnListWidget: function () {
                return $commonWidgets.List.create();
            },

            /**
             * Retrieves the internal List instance.
             * @returns {$commonWidgets.List}
             */
            getListWidget: function () {
                return this.getChild('options-list');
            },

            /**
             * @param {$widget.WidgetEvent} event
             * @ignore
             */
            onOptionFocus: function (event) {
                var element = this.getElement();

                if (!element) {
                    return;
                }

                var $element = $(element),
                    dropdownHeight = $element.outerHeight(),
                    optionList = this.getChild('options-list'),
                    optionListTop = $element.scrollTop(),
                    $option = $(optionList.getChild(event.payload.optionName).getElement()),
                    optionHeight = $option.outerHeight(),
                    optionTop = $option.position().top,

                // whether option in focus overlaps with or touches the top of the dropdown
                    isTooHigh = optionTop < optionListTop,

                // whether option in focus overlaps with or touches the bottom of the dropdown
                    isTooLow = optionTop + optionHeight > optionListTop + dropdownHeight;

                if (isTooHigh) {
                    // positioning to top of dropdown
                    $element.scrollTop(optionTop);
                } else if (isTooLow) {
                    // positioning to bottom of dropdown
                    $element.scrollTop(optionTop + optionHeight - dropdownHeight);
                }
            },

            /**
             * TODO: Use giant events as soon as .getOriginalEventByName is available in giant-event.
             * @param {$widget.WidgetEvent} event
             * @ignore
             */
            onOptionSelect: function (event) {
                var originalEvent = event.getOriginalEventByType(jQuery.Event);

                if (originalEvent && (
                    originalEvent.type === 'click' ||
                    originalEvent.type === 'keydown' && originalEvent.which === 13
                    )) {
                    // only when select was initiated by user interaction (click on Option)
                    this.closePopup();
                }
            },

            /**
             * @ignore
             */
            onOptionsEscape: function () {
                this.closePopup();
            }
        });
}, jQuery);
