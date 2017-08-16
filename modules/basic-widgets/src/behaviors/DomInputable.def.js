$oop.postpone($basicWidgets, 'DomInputable', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend()
            .addTraitAndExtend($basicWidgets.Disableable);

    /**
     * To be used by common inputs, such as text, select, button, etc.
     * Input widgets share the following properties:
     * - have a name
     * - have a value (state)
     * - can be disabled
     * - can be associated with labels
     * - trigger events when properties change (name & value)
     * Expects to be added to widgets bearing the Disableable trait.
     * Remark: Common inputs just _happen_ to share name and disabled properties / attributes,
     * they're not implementing a common interface within the DOM.
     * Unfortunately the same doesn't apply to the value property / attribute,
     * hence the corresponding virtual methods.
     * TODO: Break up into DomNamed & InputPartial (linking labels)?
     * @class
     * @extends $oop.Base
     * @extends $basicWidgets.Disableable
     * @extends $basicWidgets.Widget
     */
    $basicWidgets.DomInputable = self
        .addPrivateMethods(/** @lends $basicWidgets.DomInputable# */{
            /**
             * TODO: Perhaps control the DOM property rather than HTML attribute.
             * @private
             */
            _updateDisabledAttribute: function () {
                if (this.isDisabled()) {
                    this.addAttribute('disabled', 'disabled');
                } else {
                    this.removeAttribute('disabled');
                }
            },

            /** @private */
            _updateDisabledState: function () {
                var name = this.getName();

                if (name) {
                    this.enableBy('input-name-availability');
                } else {
                    this.disableBy('input-name-availability');
                }
            }
        })
        .addMethods(/** @lends $basicWidgets.DomInputable# */{
            /**
             * Call from host's afterAdd
             */
            afterAdd: function () {
                this._updateDisabledState();
            },

            /**
             * Call from host's .afterStateOn
             */
            afterStateOn: function (stateName) {
                if (stateName === self.STATE_NAME_DISABLED) {
                    this._updateDisabledAttribute();
                }
            },

            /**
             * Call from host's .afterStateOff
             */
            afterStateOff: function (stateName) {
                if (stateName === self.STATE_NAME_DISABLED) {
                    this._updateDisabledAttribute();
                }
            },

            /**
             * @param {$basicWidgets.Text} labelWidget
             * @returns {$basicWidgets.DomInputable}
             */
            linkLabelWidget: function (labelWidget) {
                $assertion.assert($basicWidgets.Text.isBaseOf(labelWidget),
                    "Invalid label widget");

                labelWidget
                    .setTagName('label')
                    .addAttribute('for', this.htmlAttributes.idAttribute);

                return this;
            },

            /**
             * @param {string} name
             * @returns {$basicWidgets.DomInputable}
             */
            setName: function (name) {
                this.addAttribute('name', name);
                this._updateDisabledState();
                return this;
            },

            /**
             * Clears input name attribute.
             * @returns {$basicWidgets.DomInputable}
             * @deprecated Necessary?
             */
            clearName: function () {
                this.removeAttribute('name');
                this._updateDisabledState();
                return this;
            },

            /**
             * @returns {string}
             */
            getName: function () {
                return this.htmlAttributes.getItem('name');
            }
        });

    /**
     * @name $basicWidgets.DomInputable#setValue
     * @function
     * @param {string} value
     * @returns {$basicWidgets.DomInputable}
     */

    /**
     * @name $basicWidgets.DomInputable#getValue
     * @function
     * @returns {string}
     */
});
