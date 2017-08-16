$oop.postpone($commonWidgets, 'Image', function (ns, className) {
    "use strict";

    var base = $widget.Widget,
        self = base.extend(className);

    /**
     * Creates an Image instance.
     * @name $commonWidgets.Image.create
     * @function
     * @returns {$commonWidgets.Image}
     */

    /**
     * The Image displays an <em>img</em> tag.
     * @class
     * @extends $widget.Widget
     */
    $commonWidgets.Image = self
        .addMethods(/** @lends $commonWidgets.Image# */{
            /** @ignore */
            init: function () {
                base.init.call(this);
                this.setTagName('img');

                /** @type {$transport.ImageUrl} */
                this.imageUrl = undefined;
            },

            /**
             * Sets absolute image URL.
             * @param {$transport.ImageUrl} imageUrl ImageUrl instance.
             * @example
             * image.setImageUrl('http://httpcats.herokuapp.com/418'.toImageUrl())
             * @returns {$commonWidgets.Image}
             */
            setImageUrl: function (imageUrl) {
                $assertion.isLocation(imageUrl, "Invalid image URL");
                this.addAttribute('src', imageUrl.toString());
                this.imageUrl = imageUrl;
                return this;
            }
        });
});
