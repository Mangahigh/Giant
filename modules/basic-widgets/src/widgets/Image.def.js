$oop.postpone($basicWidgets, 'Image', function (ns, className) {
    "use strict";

    var base = $widget.Widget,
        self = base.extend(className);

    /**
     * Creates an Image instance.
     * @name $basicWidgets.Image.create
     * @function
     * @returns {$basicWidgets.Image}
     */

    /**
     * Represents an image. (Image tag.)
     * @class
     * @extends $widget.Widget
     */
    $basicWidgets.Image = self
        .addMethods(/** @lends $basicWidgets.Image# */{
            /** @ignore */
            init: function () {
                base.init.call(this);
                this.setTagName('img');
            },

            /**
             * Sets absolute image URL.
             * @param {string} imageUrl ImageUrl instance.
             * @example
             * image.setImageUrl('http://httpcats.herokuapp.com/418')
             * @returns {$basicWidgets.Image}
             */
            setImageUrl: function (imageUrl) {
                this.addAttribute('src', imageUrl);
                return this;
            },

            /**
             * Retrieves the URL associated with the Image.
             * @returns {string}
             */
            getImageUrl: function () {
                return this.htmlAttributes.getItem('src');
            }
        });
});
