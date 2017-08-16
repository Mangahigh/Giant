$oop.postpone($basicWidgets, 'LocaleText', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.Text,
        self = base.extend(cn)
            .addTrait($i18n.LocaleBound);

    /**
     * Creates a LocaleText instance.
     * @name $basicWidgets.LocaleText.create
     * @function
     * @returns {$basicWidgets.LocaleText}
     */

    /**
     * Shorthand for localized text that updates on locale change (locale 'ready' change).
     * @class
     * @extends $basicWidgets.Text
     * @extends $i18n.LocaleBound
     */
    $basicWidgets.LocaleText = self
        .addMethods(/** @lends $basicWidgets.LocaleText# */{
            /**
             * @ignore
             */
            init: function () {
                base.init.call(this);
                $i18n.LocaleBound.init.call(this);
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                this.bindToCurrentLocaleReady('onCurrentLocaleReady');
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                this.unbindFromCurrentLocaleReady('onCurrentLocaleReady');
            },

            /** @ignore */
            onCurrentLocaleReady: function () {
                this.reRenderContents();
            }
        });
});
