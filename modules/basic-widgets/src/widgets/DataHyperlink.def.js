$oop.postpone($basicWidgets, 'DataHyperlink', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.Hyperlink,
        self = base.extend(cn)
            .addTrait($basicWidgets.EntityTagged);

    /**
     * Creates a DataHyperlink instance.
     * @name $basicWidgets.DataHyperlink.create
     * @function
     * @param {$entity.FieldKey} urlKey Identifies the URL associated with the link.
     * @returns {$basicWidgets.DataHyperlink}
     */

    /**
     * Displays a link based on the value of a field in the cache.
     * Keeps the target URL in sync with the changes of the corresponding field.
     * This is a general implementation with independent fields for URL and text.
     * @class
     * @extends $basicWidgets.Hyperlink
     * @extends $basicWidgets.EntityTagged
     */
    $basicWidgets.DataHyperlink = self
        .addPrivateMethods(/** @lends $basicWidgets.DataHyperlink# */{
            /** @private */
            _updateTargetUrl: function () {
                var targetUrl = this.entityKey.toField().getValue();
                this.setTargetUrl(targetUrl);
            }
        })
        .addMethods(/** @lends $basicWidgets.DataHyperlink# */{
            /**
             * @param {$entity.FieldKey} urlKey
             * @ignore
             */
            init: function (urlKey) {
                $assertion.isFieldKey(urlKey, "Invalid field key");

                base.init.call(this);
                $basicWidgets.EntityTagged.init.call(this, urlKey);
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                this._updateTargetUrl();
                this.bindToDelegatedEntityChange(this.entityKey, 'onUrlChange');
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                this.unbindFromDelegatedEntityChange(this.entityKey, 'onUrlChange');
            },

            /** @ignore */
            onUrlChange: function () {
                this._updateTargetUrl();
            }
        });
});
