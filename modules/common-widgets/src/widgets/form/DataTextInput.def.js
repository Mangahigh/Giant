$oop.postpone($commonWidgets, 'DataTextInput', function (ns, className) {
    "use strict";

    var base = $commonWidgets.TextInput,
        self = base.extend(className)
            .addTrait($entity.EntityBound)
            .addTrait($commonWidgets.EntityWidget)
            .addTraitAndExtend($commonWidgets.FieldBound);

    /**
     * Creates a DataTextInput instance.
     * @name $commonWidgets.DataTextInput.create
     * @function
     * @param {$entity.FieldKey} inputFieldKey
     * @returns {$commonWidgets.DataTextInput}
     */

    /**
     * The DataTextInput adds data binding to TextInput, reflecting the value of a field in the cache.
     * Keeps the value of the input field in sync with the changes of the cache field.
     * @class
     * @extends $commonWidgets.TextInput
     * @extends $entity.EntityBound
     * @extends $commonWidgets.EntityWidget
     * @extends $commonWidgets.FieldBound
     */
    $commonWidgets.DataTextInput = self
        .addMethods(/** @lends $commonWidgets.DataTextInput# */{
            /**
             * @param {$entity.FieldKey} inputFieldKey
             * @ignore
             */
            init: function (inputFieldKey) {
                base.init.call(this);
                $entity.EntityBound.init.call(this);
                $commonWidgets.EntityWidget.init.call(this, inputFieldKey);
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
             * @returns {$commonWidgets.DataTextInput}
             * @ignore
             */
            setFieldValue: function (fieldValue) {
                this.setInputValue(typeof fieldValue === 'undefined' ? fieldValue : String(fieldValue), true);
                return this;
            }
        });
});
