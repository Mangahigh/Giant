$oop.postpone($basicWidgets, 'SelectPartial', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * Implements common functionality for SingleSelect & MultiSelect.
     * @class
     * @extends $oop.Base
     * @extends $basicWidgets.List
     * @ignore
     */
    $basicWidgets.SelectPartial = self
        .addMethods(/** @lends $basicWidgets.SelectPartial# */{
            /** @ignore */
            init: function () {
                this.setTagName('select');
            },

            /**
             * Adds option widget to the select.
             * Only allows Option instances the value on which are not yet present in the SelectPartial.
             * @param {$basicWidgets.Selectable} itemWidget
             * @returns {$basicWidgets.SelectPartial}
             */
            addItemWidget: function (itemWidget) {
                $assertion
                    .assert(itemWidget && itemWidget.tagName === 'option', "Invalid option widget");

                return this;
            },

            /**
             * Shorthand for adding an option to the select.
             * @param {string} childName
             * @param {string} optionValue
             * @param {string|$utils.Stringifiable} optionText
             * @param {boolean} [selected]
             * @returns {$basicWidgets.SelectPartial}
             */
            addOption: function (childName, optionValue, optionText, selected) {
                var optionWidget = $basicWidgets.Option.create()
                    .setChildName(childName)
                    .setValue(optionValue)
                    .setContentString(optionText);

                if (selected) {
                    optionWidget.select();
                }

                this.addItemWidget(optionWidget);

                return this;
            },

            /**
             * Shorthand for adding a locale-bound option to the select.
             * @param {string} childName
             * @param {string} optionValue
             * @param {string|$utils.Stringifiable} optionText
             * @param {boolean} [selected]
             * @returns {$basicWidgets.SelectPartial}
             */
            addLocaleOption: function (childName, optionValue, optionText, selected) {
                var optionWidget = $basicWidgets.LocaleOption.create()
                    .setChildName(childName)
                    .setValue(optionValue)
                    .setContentString(optionText);

                if (selected) {
                    optionWidget.select();
                }

                this.addItemWidget(optionWidget);

                return this;
            }
        });
});

$oop.addGlobalConstants.call($basicWidgets, /** @lends $basicWidgets */{
    /**
     * Signals that the selected value(s) in a select have changed.
     * @constants
     */
    EVENT_SELECT_SELECTION_CHANGE: 'widget.change.select.selection'
});
