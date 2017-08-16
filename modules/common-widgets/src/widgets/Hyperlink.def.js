$oop.postpone($commonWidgets, 'Hyperlink', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = $widget.Widget,
        self = base.extend(className);

    /**
     * Creates a Hyperlink instance.
     * @name $commonWidgets.Hyperlink.create
     * @function
     * @returns {$commonWidgets.Hyperlink}
     */

    /**
     * Implements a basic hyperlink.
     * @class
     * @extends $widget.Widget
     */
    $commonWidgets.Hyperlink = self
        .addMethods(/** @lends $commonWidgets.Hyperlink# */{
            /** @ignore */
            init: function () {
                base.init.call(this);
                this.setTagName('a');

                this.spawnLabelWidget()
                    .setChildName('link-label')
                    .addToParent(this);
            },

            /**
             * Creates Label widget to be used inside the link.
             * Override to specify custom widget.
             * @returns {$commonWidgets.Label}
             */
            spawnLabelWidget: function () {
                return $commonWidgets.Label.create();
            },

            /**
             * Retrieves the label widget contained within the link.
             * @returns {$commonWidgets.Label}
             */
            getLabelWidget: function () {
                return this.getChild('link-label');
            },

            /**
             * Sets URL for the link.
             * @param {string} targetUrl
             * @returns {$commonWidgets.Hyperlink}
             */
            setTargetUrl: function (targetUrl) {
                $assertion.isString(targetUrl, "Invalid target URL");

                var element = this.getElement();
                if (element) {
                    $(element).attr('href', targetUrl);
                }

                this.addAttribute('href', targetUrl);

                return this;
            },

            /**
             * Sets the link's caption.
             * Expects the caption widget to be a Label.
             * Override when caption widget is something other than Label.
             * @param {string} caption
             * @returns {$commonWidgets.Hyperlink}
             */
            setCaption: function (caption) {
                this.getLabelWidget()
                    .setLabelText(caption);
                return this;
            }
        });
}, jQuery);
