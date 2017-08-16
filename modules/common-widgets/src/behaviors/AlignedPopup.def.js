$oop.postpone($commonWidgets, 'AlignedPopup', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = $commonWidgets.Popup,
        self = base.extend();

    /**
     * The AlignedPopup trait extends the Popup trait with aligning the widget's DOM to the DOM of its parent.
     * Relies on jQuery UI's positioning.
     * @class
     * @extends $commonWidgets.Popup
     * @link http://api.jqueryui.com/position
     */
    $commonWidgets.AlignedPopup = self
        .addPrivateMethods(/** @lends $commonWidgets.AlignedPopup# */{
            /** @private */
            _alignPopup: function () {
                var element = this.getElement();
                if (element) {
                    $(element).position(this.positionOptions.items);
                }
            },

            /** @private */
            _updateOfPositionOption: function () {
                var parentElement = this.parent.getElement();
                if (parentElement) {
                    this.setPositionOption('of', $(parentElement));
                }
                return this;
            }
        })
        .addMethods(/** @lends $commonWidgets.AlignedPopup# */{
            /** Call from host class' init. */
            init: function () {
                base.init.call(this);

                this.elevateMethod('onResize');

                /**
                 * Options for positioning the select list popup around its parent.
                 * @type {$data.Collection}
                 */
                this.positionOptions = $data.Collection.create({
                    my: 'left top',
                    at: 'left bottom'
                });
            },

            /** Call from host class' afterAdd. */
            afterAdd: function () {
                base.afterAdd.call(this);
                this.subscribeTo($commonWidgets.EVENT_WINDOW_RESIZE_DEBOUNCED, this.onResize);
            },

            /** Call from host class' afterRender. */
            afterRender: function () {
                base.afterRender.call(this);
                this._updateOfPositionOption();
            },

            /**
             * Sets jQuery UI position option. Accepts any options combination that jQuery UI's .position() does.
             * @param {string} optionName
             * @param {*} [optionValue]
             * @returns {$commonWidgets.AlignedPopup}
             * @link http://api.jqueryui.com/position/
             */
            setPositionOption: function (optionName, optionValue) {
                if (typeof optionValue === 'undefined') {
                    this.positionOptions.deleteItem(optionName);
                } else {
                    this.positionOptions.setItem(optionName, optionValue);
                }
                this._alignPopup();
                return this;
            },

            /** @ignore */
            onResize: function () {
                this._alignPopup();
            }
        });
}, jQuery);