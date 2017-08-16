$oop.postpone($basicWidgets, 'Hyperlink', function (ns, cn) {
    "use strict";

    var base = $widget.Widget,
        self = base.extend(cn);

    /**
     * Creates a Hyperlink instance.
     * @name $basicWidgets.Hyperlink.create
     * @function
     * @returns {$basicWidgets.Hyperlink}
     */

    /**
     * Implements an empty hyperlink.
     * Add content (text, image, etc) as ad-hoc child widgets, or alternatively,
     * subclass Hyperlink to implement re-usable, composite content.
     * @class
     * @extends $widget.Widget
     */
    $basicWidgets.Hyperlink = self
        .addMethods(/** @lends $basicWidgets.Hyperlink# */{
            /** @ignore */
            init: function () {
                base.init.call(this);
                this.setTagName('a');
            },

            /**
             * Sets URL for the link.
             * @param {string} targetUrl
             * @returns {$basicWidgets.Hyperlink}
             */
            setTargetUrl: function (targetUrl) {
                this.addAttribute('href', targetUrl);
                return this;
            },

            /**
             * Retrieves URL associated with the link.
             * @returns {string}
             */
            getTargetUrl: function () {
                return this.htmlAttributes.getItem('href');
            }
        });
});
