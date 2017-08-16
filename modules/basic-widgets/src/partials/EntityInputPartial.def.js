$oop.postpone($basicWidgets, 'EntityInputPartial', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * Implements entity binding for the name and value attributes of an input.
     * Expects to be added to hosts bearing the EntityBound trait.
     * TODO: Handle validity?
     * @class
     * @extends $oop.Base
     * @extends $entity.EntityBound
     * @extends $basicWidgets.DomInputable
     * @ignore
     */
    $basicWidgets.EntityInputPartial = self
        .addPrivateMethods(/** @lends $basicWidgets.EntityInputPartial# */{
            /** @private */
            _syncInputNameToEntity: function () {
                var nameKey = this.nameKey,
                    name = nameKey && nameKey.toField().getValue();

                if (nameKey) {
                    if (name) {
                        this.setName(name);
                    } else {
                        this.clearName();
                    }
                }
            },

            /**
             * TODO: Do not use setValue here. Call this from setValue.
             * @private
             */
            _syncInputValueToEntity: function () {
                var value = this.valueKey.toEntity().getValue();
                this.setValue(value);
            }
        })
        .addMethods(/** @lends $basicWidgets.EntityInputPartial# */{
            /**
             * Call from host's init
             * @param {$entity.FieldKey|$entity.ItemKey} valueKey Identifies the input's value
             * @param {$entity.FieldKey|$entity.ItemKey} [nameKey] Identifies the input's name
             */
            init: function (valueKey, nameKey) {
                /** @type {$entity.FieldKey|$entity.ItemKey} */
                this.valueKey = valueKey;

                /** @type {$entity.FieldKey|$entity.ItemKey} */
                this.nameKey = nameKey;
            },

            /**
             * Call from host's afterAdd
             */
            afterAdd: function () {
                this._syncInputValueToEntity();
                this.bindToDelegatedEntityChange(this.valueKey, 'onValueFieldChange');

                if (this.nameKey) {
                    this._syncInputNameToEntity();
                    this.bindToDelegatedEntityChange(this.nameKey, 'onNameFieldChange');
                }
            },

            /**
             * Call from host's afterRemove
             */
            afterRemove: function () {
                this.unbindFromDelegatedEntityChange(this.valueKey, 'onValueFieldChange');

                if (this.nameKey) {
                    this.unbindFromDelegatedEntityChange(this.nameKey, 'onNameFieldChange');
                }
            },

            /** @ignore */
            onValueFieldChange: function () {
                this._syncInputValueToEntity();
            },

            /** @ignore */
            onNameFieldChange: function () {
                this._syncInputNameToEntity();
            }
        });
});
