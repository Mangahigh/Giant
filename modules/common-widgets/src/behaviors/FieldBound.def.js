$oop.postpone($commonWidgets, 'FieldBound', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * Effectuates field value change on widget.
     * Implement in host class.
     * @name $commonWidgets.FieldBound#setFieldValue
     * @function
     * @param {*} fieldValue
     * @returns {$commonWidgets.FieldBound}
     */

    /**
     * The FieldBound trait adds a callback method to the host class that is invoked each time the value at
     * the field key associated with the host class changes.
     * Expects to be added to widgets that also have the EntityBound and EntityWidget traits.
     * @class
     * @extends $oop.Base
     * @extends $entity.EntityBound
     * @extends $commonWidgets.EntityWidget
     * @extends $widget.Widget
     */
    $commonWidgets.FieldBound = self
        .addPrivateMethods(/** @lends $commonWidgets.FieldBound# */{
            /** @private */
            _updateFieldValue: function () {
                var fieldValue = this.entityKey.toField().getValue();
                this.setFieldValue(fieldValue);
            }
        })
        .addMethods(/** @lends $commonWidgets.FieldBound# */{
            /** Call from host's afterAdd. */
            afterAdd: function () {
                this._updateFieldValue();
                // TODO: Use .bindToFieldChange().
                this
                    .bindToEntityChange(this.entityKey.documentKey, 'onDocumentReplace')
                    .bindToEntityChange(this.entityKey, 'onFieldChange');
            },

            /** Call from host's afterRemove. */
            afterRemove: function () {
                this
                    .unbindFromEntityChange(this.entityKey.documentKey, 'onDocumentReplace')
                    .unbindFromEntityChange(this.entityKey, 'onFieldChange');
            },

            /**
             * @ignore
             */
            onDocumentReplace: function () {
                this._updateFieldValue();
            },

            /**
             * @ignore
             */
            onFieldChange: function () {
                this._updateFieldValue();
            }
        });
});
