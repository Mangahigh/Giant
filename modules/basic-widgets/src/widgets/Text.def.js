$oop.postpone($basicWidgets, 'Text', function (ns, cn) {
    "use strict";

    var base = $widget.Widget,
        self = base.extend(cn)
            .addTrait($basicWidgets.Formattable);

    /**
     * Creates a Text instance.
     * @name $basicWidgets.Text.create
     * @function
     * @returns {$basicWidgets.Text}
     */

    /**
     * Displays text, optionally HTML escaped, based on a string literal or Stringifiable object.
     * TODO: Move functionality to a partial class.
     * @class
     * @extends $widget.Widget
     * @extends $basicWidgets.Formattable
     */
    $basicWidgets.Text = self
        .addPrivateMethods(/** @lends $basicWidgets.Text# */{
            /**
             * @param {string} str
             * @returns {string}
             * @private
             */
            _htmlEscape: function (str) {
                return str.toHtml();
            },

            /**
             * Updates Text's CSS classes based on its content.
             * @private
             */
            _updateStyle: function () {
                var contentString = $utils.Stringifier.stringify(this.contentString);
                if (contentString) {
                    this
                        .removeCssClass('text-empty')
                        .addCssClass('text-has-content');
                } else {
                    this
                        .removeCssClass('text-has-content')
                        .addCssClass('text-empty');
                }
            }
        })
        .addMethods(/** @lends $basicWidgets.Text# */{
            /** @ignore */
            init: function () {
                base.init.call(this);
                $basicWidgets.Formattable.init.call(this);

                /**
                 * String contents of the Text widget.
                 * @type {string|$utils.Stringifiable}
                 */
                this.contentString = undefined;

                this.setTagName('span')

                    // HTML escaping should be the last formatter
                    .addFormatter('z-html-escape', this._htmlEscape.toStringFilter())

                    // HTML escaped by default
                    .setHtmlEscaped(true);

                this._updateStyle();
            },

            /** @ignore */
            contentMarkup: function () {
                return this.getFormattedString();
            },

            /**
             * @returns {string}
             */
            getOriginalString: function () {
                return $utils.Stringifier.stringify(this.contentString);
            },

            /**
             * TODO: Use proxy
             * @returns {string|$utils.Stringifiable}
             */
            setDomString: function (domString) {
                var element = this.getElement();
                if (element) {
                    element.innerHTML = domString;
                }
            },

            /**
             * Sets text to display on label. Accepts strings or objects that implement .toString().
             * Displayed text will be HTML encoded.
             * @param {string|$utils.Stringifiable} contentString
             * @returns {$basicWidgets.Text}
             */
            setContentString: function (contentString) {
                if (this.contentString !== contentString) {
                    this.contentString = contentString;
                    this.reRenderContents();
                    this._updateStyle();
                }
                return this;
            },

            /**
             * Sets flag that determines whether label will HTML escape text before rendering.
             * Use with care: script embedded in contentString might compromise security!
             * @param {boolean} htmlEscaped
             * @returns {$basicWidgets.Text}
             */
            setHtmlEscaped: function (htmlEscaped) {
                if (htmlEscaped) {
                    this.activateFormatter('z-html-escape');
                } else {
                    this.deactivateFormatter('z-html-escape');
                }
                return this;
            }
        });
});
