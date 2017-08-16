$oop.postpone($basicWidgets, 'DataBinaryInput', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.BinaryInput,
        self = base.extend(cn)
            .addTrait($basicWidgets.EntityTagged)
            .addTraitAndExtend($basicWidgets.EntityInputPartial);

    /**
     * @name $basicWidgets.DataBinaryInput.create
     * @function
     * @param {string} [inputType]
     * @param {$entity.FieldKey} valueKey
     * @param {$entity.FieldKey} [nameKey]
     * @returns {$basicWidgets.DataBinaryInput}
     */

    /**
     * Databound version of checkbox or radio button.
     * Binds value and name attributes, but not state.
     * Binding state of binary inputs is the responsibility of their parents.
     * (CheckboxGroup's or RadioGroups)
     * @class
     * @extends $basicWidgets.BinaryInput
     * @extends $basicWidgets.EntityTagged
     * @extends $basicWidgets.EntityInputPartial
     */
    $basicWidgets.DataBinaryInput = self
        .addMethods(/** @lends $basicWidgets.DataBinaryInput# */{
            /**
             * @param {string} [inputType]
             * @param {$entity.FieldKey} valueKey
             * @param {$entity.FieldKey} [nameKey]
             * @ignore
             */
            init: function (inputType, valueKey, nameKey) {
                $assertion
                    .isFieldKey(valueKey, "Invalid input value key")
                    .isFieldKeyOptional(nameKey, "Invalid input name key");

                base.init.call(this, inputType);
                $basicWidgets.EntityTagged.init.call(this, valueKey);
                $basicWidgets.EntityInputPartial.init.call(this, valueKey, nameKey);
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                $basicWidgets.EntityInputPartial.afterAdd.call(this);
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                $basicWidgets.EntityInputPartial.afterRemove.call(this);
            }
        });
});
