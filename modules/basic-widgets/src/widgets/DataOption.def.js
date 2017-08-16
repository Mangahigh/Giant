$oop.postpone($basicWidgets, 'DataOption', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.DataText,
        self = base.extend(cn)
            .addTrait($basicWidgets.BinaryStateful)
            .addTraitAndExtend($basicWidgets.Disableable, 'Disableable')
            .addTraitAndExtend($basicWidgets.OptionPartial);

    /**
     * Creates a DataOption instance.
     * @name $basicWidgets.DataOption.create
     * @function
     * @param {$entity.DocumentKey} optionKey
     * @param {$entity.FieldKey} [valueKey]
     * @returns {$basicWidgets.DataOption}
     */

    /**
     * A select option with static text inside.
     * @class
     * @extends $basicWidgets.DataText
     * @extends $basicWidgets.BinaryStateful
     * @extends $basicWidgets.Disableable
     * @extends $basicWidgets.OptionPartial
     */
    $basicWidgets.DataOption = self
        .addPrivateMethods(/** @lends $basicWidgets.DataOption# */{
            /** @private */
            _syncValueToEntity: function () {
                var oldValue = this.getValue(),
                    newValue = this.valueKey.toField().getValue();

                if (newValue !== oldValue) {
                    this.setValue(newValue);
                }
            }
        })
        .addMethods(/** @lends $basicWidgets.DataOption# */{
            /**
             * @param {$entity.FieldKey} descriptionKey
             * @param {$entity.FieldKey} [valueKey]
             * @ignore
             */
            init: function (descriptionKey, valueKey) {
                $assertion.isFieldKeyOptional(valueKey, "Invalid value key");

                base.init.call(this, descriptionKey);
                $basicWidgets.BinaryStateful.init.call(this);
                $basicWidgets.Disableable.init.call(this);
                $basicWidgets.OptionPartial.init.call(this);

                /**
                 * Identifies option value in the entity store.
                 * When absent, value is expected to be set via `setValue`.
                 * @type {$entity.FieldKey}
                 */
                this.valueKey = valueKey;
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                $basicWidgets.BinaryStateful.afterAdd.call(this);
                $basicWidgets.OptionPartial.afterAdd.call(this);

                if (this.valueKey) {
                    this._syncValueToEntity();
                    this.bindToDelegatedEntityChange(this.valueKey, 'onValueChange');
                }
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                $basicWidgets.BinaryStateful.afterRemove.call(this);

                if (this.valueKey) {
                    this.unbindFromDelegatedEntityChange(this.valueKey, 'onValueChange');
                }
            },

            /** @ignore */
            afterRender: function () {
                base.afterRender.call(this);
                $basicWidgets.OptionPartial.afterRender.call(this);
            },

            /** @ignore */
            afterStateOn: function () {
                $basicWidgets.Disableable.afterStateOn.call(this);
                $basicWidgets.OptionPartial.afterStateOn.call(this);
            },

            /** @ignore */
            afterStateOff: function () {
                $basicWidgets.Disableable.afterStateOff.call(this);
                $basicWidgets.OptionPartial.afterStateOff.call(this);
            },

            /** @ignore */
            onValueChange: function () {
                this._syncValueToEntity();
            }
        });
});
