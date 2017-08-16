$oop.postpone(window, 'TestListItem', function (ns, cn) {
    "use strict";

    var base = $widget.Widget,
        self = base.extend(cn);

    /**
     * @name window.TestListItem.create
     * @function
     * @returns {window.TestListItem}
     */

    /**
     * @class
     * @extends $widget.Widget
     */
    window.TestListItem = self
        .addPublic(/** @lends window.TestListItem */{
            /** @type {$widget.MarkupTemplate} */
            contentTemplate: [
                //@formatter:off
                '<div class="name-container"></div>',
                '<div class="widget-container"></div>',
                '<div class="attributes-container"></div>',
                '<pre class="code-container"></pre>',
                '<div class="hint-container"></div>'
                //@formatter:on
            ].join('').toMarkupTemplate()
        })
        .addMethods(/** @lends window.TestListItem# */{
            /**
             * @ignore
             */
            init: function () {
                base.init.call(this);

                $basicWidgets.Text.create()
                    .setChildName('widget-class-name')
                    .setTagName('h2')
                    .setContainerCssClass('name-container')
                    .addToParent(this);

                $basicWidgets.Text.create()
                    .setChildName('widget-class-note')
                    .setTagName('h3')
                    .setContainerCssClass('name-container')
                    .addToParent(this);

                $widget.Widget.create()
                    .setChildName('widget-attributes')
                    .addChild($basicWidgets.Text.create()
                        .setChildName('widget-id'))
                    .addChild($basicWidgets.Text.create()
                        .setChildName('widget-entity-key'))
                    .setContainerCssClass('attributes-container')
                    .addToParent(this);

                $basicWidgets.Text.create()
                    .setChildName('widget-code')
                    .setTagName('code')
                    .setContainerCssClass('code-container')
                    .addToParent(this);

                $basicWidgets.Text.create()
                    .setChildName('widget-hint')
                    .setTagName('code')
                    .setContainerCssClass('hint-container')
                    .addToParent(this);
            },

            /**
             * @param {$widget.Widget} contentWidget
             * @returns {TestListItem}
             */
            setContentWidget: function (contentWidget) {
                contentWidget
                    .setContainerCssClass('widget-container')
                    .addToParent(this);

                this.getChild('widget-class-name')
                    .setContentString(contentWidget.className);

                this.getChild('widget-attributes')
                    .getChild('widget-id')
                    .setContentString(contentWidget.htmlAttributes.idAttribute);

                this.getChild('widget-attributes')
                    .getChild('widget-entity-key')
                    .setContentString($utils.Stringifier.stringify(contentWidget.entityKey));

                return this;
            },

            /**
             * @param {string|$utils.Stringifiable} noteString
             * @returns {TestListItem}
             */
            setNoteString: function (noteString) {
                this.getChild('widget-class-note')
                    .setContentString(noteString);
                return this;
            },

            /**
             * @param {string|$utils.Stringifiable} hintString
             * @returns {TestListItem}
             */
            setHintString: function (hintString) {
                this.getChild('widget-hint')
                    .setContentString(hintString);
                return this;
            },

            /**
             * @param {string} codeString
             * @returns {TestListItem}
             */
            setCodeString: function (codeString) {
                this.getChild('widget-code')
                    .setContentString(codeString);
                return this;
            }
        });
});
