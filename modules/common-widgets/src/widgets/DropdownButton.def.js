$oop.postpone($commonWidgets, 'DropdownButton', function (ns, className) {
    "use strict";

    var base = $commonWidgets.TextButton,
        self = base.extend(className);

    /**
     * Creates a DropdownButton instance.
     * @name $commonWidgets.DropdownButton.create
     * @function
     * @returns {$commonWidgets.DropdownButton}
     */

    /**
     * The DropdownButton, when activated, pops up a dropdown, from which the user may select an option,
     * and the selected option will be set as the dropdown button's current caption.
     * The DropdownButton changes its state as the dropdown opens and closes.
     * @class
     * @extends $commonWidgets.TextButton
     */
    $commonWidgets.DropdownButton = self
        .addPrivateMethods(/** @lends $commonWidgets.DropdownButton# */{
            /** @private */
            _updateOpenStyle: function () {
                var dropdown = this.dropdown;
                if (dropdown && dropdown.isOpen) {
                    this
                        .removeCssClass('dropdown-closed')
                        .addCssClass('dropdown-open');
                } else {
                    this
                        .removeCssClass('dropdown-open')
                        .addCssClass('dropdown-closed');
                }
            }
        })
        .addMethods(/** @lends $commonWidgets.DropdownButton# */{
            /** @ignore */
            init: function () {
                base.init.call(this);

                this
                    .elevateMethod('onDropdownOpen')
                    .elevateMethod('onDropdownClose');

                /**
                 * Dropdown widget for showing the options.
                 * Must have instance-level reference to it since this widget will be removed and re-added
                 * to the widget hierarchy.
                 * @type {$commonWidgets.Dropdown}
                 */
                this.dropdown = this.spawnDropdownWidget()
                    .treatAsInside('#' + this.htmlAttributes.idAttribute)
                    .setChildName('dropdown-popup');
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);

                this._updateOpenStyle();

                this
                    .subscribeTo($commonWidgets.EVENT_POPUP_OPEN, this.onDropdownOpen)
                    .subscribeTo($commonWidgets.EVENT_POPUP_CLOSE, this.onDropdownClose);
            },

            /**
             * Creates dropdown widget.
             * Override to specify custom dropdown.
             * @returns {$commonWidgets.Dropdown}
             */
            spawnDropdownWidget: function () {
                return $commonWidgets.Dropdown.create();
            },

            /**
             * Retrieves Dropdown instance associated with DropdownButton.
             * @returns {$commonWidgets.Dropdown}
             */
            getDropdownWidget: function () {
                return this.getChild('dropdown-popup');
            },

            /**
             * @param {$widget.WidgetEvent} event
             * @ignore
             */
            onDropdownOpen: function (event) {
                if (event.sender === this.dropdown) {
                    this._updateOpenStyle();
                }
            },

            /**
             * @param {$widget.WidgetEvent} event
             * @ignore
             */
            onDropdownClose: function (event) {
                if (event.sender === this.dropdown) {
                    this._updateOpenStyle();
                }
            },

            /**
             * @param {jQuery.Event} event
             * @ignore
             */
            onClick: function (event) {
                base.onClick.call(this);

                var dropdown = this.dropdown,
                    link = $event.pushOriginalEvent(event);

                if (dropdown.isOpen) {
                    dropdown
                        .closePopup();
                } else {
                    dropdown
                        .addToParent(this)
                        .openPopup();
                }

                link.unlink();
            }
        });
});
