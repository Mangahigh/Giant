$oop.postpone($commonWidgets, 'DataImage', function (ns, className) {
    "use strict";

    var base = $commonWidgets.Image,
        self = base.extend(className)
            .addTrait($entity.EntityBound)
            .addTrait($commonWidgets.EntityWidget)
            .addTraitAndExtend($commonWidgets.FieldBound);

    /**
     * Creates a DataImage instance.
     * @name $commonWidgets.DataImage.create
     * @function
     * @param {$entity.FieldKey} urlFieldKey Field holding image URL.
     * @returns {$commonWidgets.DataImage}
     */

    /**
     * The DataImage displays an image based on the URL stored in a field in the cache.
     * Keeps the image in sync with the changes of the corresponding field.
     * @class
     * @extends $commonWidgets.Image
     * @extends $entity.EntityBound
     * @extends $commonWidgets.EntityWidget
     * @extends $commonWidgets.FieldBound
     */
    $commonWidgets.DataImage = self
        .addMethods(/** @lends $commonWidgets.DataImage# */{
            /**
             * @param {$entity.FieldKey} urlFieldKey
             * @ignore
             */
            init: function (urlFieldKey) {
                $assertion.isFieldKey(urlFieldKey, "Invalid field key");

                base.init.call(this);
                $entity.EntityBound.init.call(this);
                $commonWidgets.EntityWidget.init.call(this, urlFieldKey);
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                $commonWidgets.FieldBound.afterAdd.call(this);
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                $commonWidgets.FieldBound.afterRemove.call(this);
            },

            /**
             * @param {string} fieldValue
             * @returns {$commonWidgets.DataImage}
             * @ignore
             */
            setFieldValue: function (fieldValue) {
                this.setImageUrl(fieldValue.toImageUrl());
                return this;
            }
        });
});
