$oop.postpone($commonWidgets, 'DataLabel', function (ns, className) {
    "use strict";

    var base = $commonWidgets.Label,
        self = base.extend(className)
            .addTrait($entity.EntityBound)
            .addTrait($commonWidgets.EntityWidget)
            .addTraitAndExtend($commonWidgets.FieldBound);

    /**
     * Creates a DataLabel instance.
     * @name $commonWidgets.DataLabel.create
     * @function
     * @param {$entity.FieldKey} textFieldKey Key to a text field.
     * @returns {$commonWidgets.DataLabel}
     */

    /**
     * The DataLabel displays text based on the value of a field in the cache.
     * Keeps the text in sync with the changes of the corresponding field.
     * @class
     * @extends $commonWidgets.Label
     * @extends $entity.EntityBound
     * @extends $commonWidgets.EntityWidget
     * @extends $commonWidgets.FieldBound
     */
    $commonWidgets.DataLabel = self
        .addMethods(/** @lends $commonWidgets.DataLabel# */{
            /**
             * @param {$entity.FieldKey} fieldKey
             * @ignore
             */
            init: function (fieldKey) {
                $assertion.isFieldKey(fieldKey, "Invalid field key");

                base.init.call(this);
                $entity.EntityBound.init.call(this);
                $commonWidgets.EntityWidget.init.call(this, fieldKey);
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
             * @param {*} fieldValue
             * @returns {$commonWidgets.DataLabel}
             * @ignore
             */
            setFieldValue: function (fieldValue) {
                this.setLabelText(fieldValue);
                return this;
            }
        });
});
