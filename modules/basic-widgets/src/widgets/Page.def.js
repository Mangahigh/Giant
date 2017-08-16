$oop.postpone($basicWidgets, 'Page', function (ns, cn) {
    "use strict";

    var base = $widget.Widget,
        self = base.extend(cn);

    /**
     * @name $basicWidgets.Page.create
     * @function
     * @returns {$basicWidgets.Page}
     */

    /**
     * Base class for pages. Pages might be changed throughout the application's life cycle.
     * @class
     * @extends $widget.Widget
     */
    $basicWidgets.Page = self
        .addMethods(/** @lends $basicWidgets.Page# */{
            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);

                var application = $basicWidgets.Application.create();
                application.spawnEvent($basicWidgets.EVENT_PAGE_ADD)
                    .setSender(this)
                    .triggerSync();
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);

                // triggering directly on Application as page is not in hierarchy anymore
                var application = $basicWidgets.Application.create();
                application.spawnEvent($basicWidgets.EVENT_PAGE_REMOVE)
                    .setSender(this)
                    .triggerSync();
            },

            /**
             * Activates page. Previous active page will be replaced.
             * @returns {$basicWidgets.Page}
             */
            setAsActivePage: function () {
                this
                    .setChildName('active-page')
                    .addToParent($basicWidgets.Application.create());

                return this;
            }
        });
});

(function () {
    "use strict";

    $oop.addGlobalConstants.call($basicWidgets, /** @lends $basicWidgets */{
        /** @constant */
        EVENT_PAGE_ADD: 'basicWidgets.page.add',

        /** @constant */
        EVENT_PAGE_REMOVE: 'basicWidgets.page.remove'
    });
}());
