$oop.postpone($commonWidgets, 'EntityWidget', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * Expects to be added to widget classes.
     * @class
     * @extends $oop.Base
     * @extends $widget.Widget
     */
    $commonWidgets.EntityWidget = self
        .addConstants(/** @lends $commonWidgets.EntityWidget */{
            /** @constant */
            ATTRIBUTE_NAME_ENTITY_KEY: 'data-entity-key'
        })
        .addMethods(/** @lends $commonWidgets.EntityWidget# */{
            /**
             * @param {$entity.EntityKey} entityKey
             */
            init: function (entityKey) {
                /** @type {$entity.EntityKey} */
                this.entityKey = entityKey;
            },

            /**
             * @returns {$commonWidgets.EntityWidget}
             */
            revealKey: function () {
                this.addAttribute(self.ATTRIBUTE_NAME_ENTITY_KEY, this.entityKey.toString());
                return this;
            },

            /**
             * @returns {$commonWidgets.EntityWidget}
             */
            hideKey: function () {
                this.removeAttribute(self.ATTRIBUTE_NAME_ENTITY_KEY);
                return this;
            }
        });
});

$oop.postpone($commonWidgets, 'revealKeys', function () {
    "use strict";

    /**
     * Reveals entity keys on all widgets that have the EntityWidget trait.
     * Entity key strings will be added to widget elements as 'data-entity-key' attribute.
     * @type {function}
     */
    $commonWidgets.revealKeys = function () {
        $widget.Widget.rootWidget.getAllDescendants()
            .callOnEachItem('revealKey');
    };
});

$oop.postpone($commonWidgets, 'hideKeys', function () {
    "use strict";

    /**
     * Removes 'data-entity-key' attribute from the DOM of all widgets that have the EntityWidget trait.
     * @type {function}
     */
    $commonWidgets.hideKeys = function () {
        $widget.Widget.rootWidget.getAllDescendants()
            .callOnEachItem('hideKey');
    };
});
