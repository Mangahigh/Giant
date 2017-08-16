$oop.postpone(window, 'TestList', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.List,
        self = base.extend(cn);

    /**
     * @name window.TestList.create
     * @function
     * @returns {window.TestList}
     */

    /**
     * @class
     * @extends $basicWidgets.List
     */
    window.TestList = self
        .addMethods(/** @lends window.TestList# */{
            /** @ignore */
            init: function () {
                base.init.call(this);
                this.setTagName('div');

                /** @type {number} */
                this.itemCount = 0;
            },

            /**
             * @param {function} widgetSpawner
             * @param {string|$utils.Stringifiable} hintString
             * @param {string|$utils.Stringifiable} noteString
             * @returns {window.TestList}
             */
            addTestItem: function (widgetSpawner, hintString, noteString) {
                var itemWidget = TestListItem.create()
                    .setChildName('item-' + $utils.StringUtils.padLeft(this.itemCount++, 3))
                    .setNoteString(noteString)
                    .setHintString(hintString)
                    .setCodeString(widgetSpawner.toString()),
                    sampleWidget = widgetSpawner(itemWidget)
                        .setChildName('sample-widget');

                itemWidget.setContentWidget(sampleWidget);

                this.addItemWidget(itemWidget);

                return this;
            }
        });
});
