$oop.postpone($basicWidgets, 'DataText', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.Text,
        self = base.extend(cn)
            .addTrait($basicWidgets.EntityTagged);

    /**
     * Creates a DataText instance.
     * @name $basicWidgets.DataText.create
     * @function
     * @param {$entity.FieldKey} textFieldKey Key to a text field.
     * @returns {$basicWidgets.DataText}
     */

    /**
     * The DataText displays text based on the value of a field in the cache.
     * Keeps the text in sync with the changes of the corresponding field.
     * @class
     * @extends $basicWidgets.Text
     * @extends $basicWidgets.EntityTagged
     */
    $basicWidgets.DataText = self
        .addPrivateMethods(/** @lends $basicWidgets.DataText# */{
            /** @private */
            _updateContentString: function () {
                this.setContentString(this.entityKey.toField().getValue());
            }
        })
        .addMethods(/** @lends $basicWidgets.DataText# */{
            /**
             * @param {$entity.FieldKey} fieldKey
             * @ignore
             */
            init: function (fieldKey) {
                $assertion.isFieldKey(fieldKey, "Invalid field key");

                base.init.call(this);
                $basicWidgets.EntityTagged.init.call(this, fieldKey);
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                this._updateContentString();
                this.bindToDelegatedEntityChange(this.entityKey, 'onFieldChange');
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                this.unbindFromDelegatedEntityChange(this.entityKey, 'onFieldChange');
            },

            /** @ignore */
            onFieldChange: function () {
                this._updateContentString();
            }
        });
});
