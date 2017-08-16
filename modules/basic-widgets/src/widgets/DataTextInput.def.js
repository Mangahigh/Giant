$oop.postpone($basicWidgets, 'DataTextInput', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.TextInput,
        self = base.extend(cn)
            .addTrait($basicWidgets.EntityTagged)
            .addTraitAndExtend($basicWidgets.EntityInputPartial);

    /**
     * @name $basicWidgets.DataTextInput.create
     * @function
     * @param {string} [inputType]
     * @param {$entity.DocumentKey} inputKey
     * @param {$entity.FieldKey} [nameKey]
     * @returns {$basicWidgets.DataTextInput}
     */

    /**
     * Entity-bound text input field.
     * TODO: Add setter for nameKey?
     * TODO: Make valueKey optional, too?
     * @class
     * @extends $basicWidgets.TextInput
     * @extends $basicWidgets.EntityTagged
     * @extends $basicWidgets.EntityInputPartial
     */
    $basicWidgets.DataTextInput = self
        .addPrivateMethods(/** @lends $basicWidgets.DataTextInput# */{
            /** @private */
            _syncEntityToInputValue: function () {
                this.valueKey.toEntity().setValue(this.value);
            }
        })
        .addMethods(/** @lends $basicWidgets.DataTextInput# */{
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
            },

            /**
             * @param {$basicWidgets.InputValueChangeEvent} event
             * @ignore
             */
            onInputValueChange: function (event) {
                base.onInputValueChange.call(this, event);
                this._syncEntityToInputValue();
            }
        });
});

