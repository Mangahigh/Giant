$oop.postpone($basicWidgets, 'Application', function (ns, cn) {
    "use strict";

    var base = $widget.Widget,
        self = base.extend(cn)
            .addTraitAndExtend($basicWidgets.BinaryStateful)
            .addTrait($basicWidgets.Disableable, 'Disableable');

    /**
     * Creates a Application instance.
     * @name $basicWidgets.Application.create
     * @function
     * @returns {$basicWidgets.Application}
     */

    /**
     * Main widget for the application. All other widgets must be descendants of Application.
     * @class
     * @extends $widget.Widget
     * @extends $basicWidgets.BinaryStateful
     * @extends $basicWidgets.Disableable
     */
    $basicWidgets.Application = self
        .setInstanceMapper(function () {
            return 'singleton';
        })
        .addMethods(/** @lends $basicWidgets.Application# */{
            /** @ignore */
            init: function () {
                base.init.call(this);
                $basicWidgets.BinaryStateful.init.call(this);
                $basicWidgets.Disableable.init.call(this);

                this.elevateMethods(
                    'onPageAdd',
                    'onPageRemove');

                // setting widget as root
                this.setRootWidget();
            },

            /** @ignore */
            afterAdd: function () {
                this.subscribeTo($basicWidgets.EVENT_PAGE_ADD, this.onPageAdd)
                    .subscribeTo($basicWidgets.EVENT_PAGE_REMOVE, this.onPageRemove);
                base.afterAdd.call(this);
            },

            /** @ignore */
            onPageAdd: function (event) {
                var page = event.sender;

                // delegating all page class CSS classes to Application
                page.getBase().htmlAttributes.cssClasses
                    .getKeysAsHash()
                    .toCollection()
                    .passEachItemTo(this.addCssClass, this);
            },

            /** @ignore */
            onPageRemove: function (event) {
                var page = event.sender;

                // removing all page-delegated classes from Application
                page.getBase().htmlAttributes.cssClasses
                    .getKeysAsHash()
                    .toCollection()
                    .passEachItemTo(this.decreaseCssClassRefCount, this);
            }
        });
});
