$oop.postpone($commonWidgets, 'TextButton', function (ns, className) {
    "use strict";

    var base = $commonWidgets.Button,
        self = base.extend(className);

    /**
     * Creates a TextButton instance.
     * @name $commonWidgets.TextButton.create
     * @function
     * @returns {$commonWidgets.TextButton}
     */

    /**
     * The TextButton extends the Button with a Label that stores text, so the button might have text on it.
     * @class
     * @extends $commonWidgets.Button
     */
    $commonWidgets.TextButton = self
        .addMethods(/** @lends $commonWidgets.TextButton# */{
            /** @ignore */
            init: function () {
                base.init.call(this);

                this.spawnLabelWidget()
                    .setChildName('button-label')
                    .addToParent(this);
            },

            /**
             * Creates Label widget to be used inside the button.
             * Override to specify custom widget.
             * @returns {$commonWidgets.Label}
             */
            spawnLabelWidget: function () {
                return $commonWidgets.Label.create();
            },

            /**
             * Retrieves the label widget contained within the button.
             * @returns {$commonWidgets.Label}
             */
            getLabelWidget: function () {
                return this.getChild('button-label');
            },

            /**
             * Sets button caption.
             * Expects the caption widget to be a Label.
             * Override when caption widget is something other than Label.
             * @param {string|$utils.Stringifiable} caption
             * @returns {$commonWidgets.TextButton}
             */
            setCaption: function (caption) {
                this.getChild('button-label')
                    .setLabelText(caption);

                return this;
            }
        });
});
