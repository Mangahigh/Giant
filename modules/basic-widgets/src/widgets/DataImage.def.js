$oop.postpone($basicWidgets, 'DataImage', function (ns, className) {
    "use strict";

    var base = $basicWidgets.Image,
        self = base.extend(className)
            .addTrait($basicWidgets.EntityTagged);

    /**
     * Creates a DataImage instance.
     * @name $basicWidgets.DataImage.create
     * @function
     * @param {$entity.FieldKey} urlKey Identifies the URL associated with the image.
     * @returns {$basicWidgets.DataImage}
     */

    /**
     * Displays an image based on the URL stored in a field in the cache.
     * Keeps the image in sync with the changes of the corresponding field.
     * @class
     * @extends $basicWidgets.Image
     * @extends $basicWidgets.EntityTagged
     */
    $basicWidgets.DataImage = self
        .addPrivateMethods(/** @lends $basicWidgets.DataImage# */{
            /** @private */
            _updateImageUrl: function () {
                var imageUrl = this.entityKey.toField().getValue();
                this.setImageUrl(imageUrl);
            }
        })
        .addMethods(/** @lends $basicWidgets.DataImage# */{
            /**
             * @param {$entity.FieldKey} urlKey
             * @ignore
             */
            init: function (urlKey) {
                $assertion.isFieldKey(urlKey, "Invalid field key");

                base.init.call(this);
                $basicWidgets.EntityTagged.init.call(this, urlKey);
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                this._updateImageUrl();
                this.bindToDelegatedEntityChange(this.entityKey, 'onUrlChange');
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                this.unbindFromDelegatedEntityChange(this.entityKey, 'onUrlChange');
            },

            /** @ignore */
            onUrlChange: function () {
                this._updateImageUrl();
            }
        });
});
