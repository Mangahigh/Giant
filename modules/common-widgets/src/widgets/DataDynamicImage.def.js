$oop.postpone($commonWidgets, 'DataDynamicImage', function (ns, className) {
    "use strict";

    var base = $commonWidgets.DynamicImage,
        self = base.extend(className)
            .addTrait($entity.EntityBound)
            .addTrait($commonWidgets.EntityWidget)
            .addTraitAndExtend($commonWidgets.FieldBound);

    /**
     * Creates a DataDynamicImage instance.
     * @name $commonWidgets.DataDynamicImage.create
     * @function
     * @param {$entity.FieldKey} urlFieldKey Field holding image URL.
     * @returns {$commonWidgets.DataDynamicImage}
     */

    /**
     * The DataDynamicImage is the data bound version of the DynamicImage.
     * Displays an image image based on the URL stored in a field in the cache.
     * Keeps the image in sync with the changes of the corresponding field.
     * @class
     * @extends $commonWidgets.DynamicImage
     * @extends $entity.EntityBound
     * @extends $commonWidgets.EntityWidget
     * @extends $commonWidgets.FieldBound
     */
    $commonWidgets.DataDynamicImage = self
        .addMethods(/** @lends $commonWidgets.DataDynamicImage# */{
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
             * @returns {$commonWidgets.DataDynamicImage}
             * @ignore
             */
            setFieldValue: function (fieldValue) {
                this.setImageUrl(fieldValue.toImageUrl());
                return this;
            }
        });
});
