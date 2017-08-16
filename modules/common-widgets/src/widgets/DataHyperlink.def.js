$oop.postpone($commonWidgets, 'DataHyperlink', function (ns, className) {
    "use strict";

    var base = $commonWidgets.Hyperlink,
        self = base.extend(className)
            .addTrait($entity.EntityBound)
            .addTrait($commonWidgets.EntityWidget)
            .addTraitAndExtend($commonWidgets.FieldBound);

    /**
     * Creates a DataHyperlink instance.
     * @name $commonWidgets.DataHyperlink.create
     * @function
     * @param {$entity.FieldKey} urlKey Points to the link's URL.
     * @param {$entity.FieldKey} textKey Points to the link's text.
     * @returns {$commonWidgets.DataHyperlink}
     */

    /**
     * The DataHyperlink displays a link based on the value of a field in the cache.
     * Keeps the target URL in sync with the changes of the corresponding field.
     * This is a general implementation with independent fields for URL and text.
     * For data links where the two fields are connected (eg. by being in the same document)
     * it might be a better idea to subclass Hyperlink directly than using DataHyperlink.
     * @class
     * @extends $commonWidgets.Hyperlink
     * @extends $entity.EntityBound
     * @extends $commonWidgets.EntityWidget
     * @extends $commonWidgets.FieldBound
     */
    $commonWidgets.DataHyperlink = self
        .addMethods(/** @lends $commonWidgets.DataHyperlink# */{
            /**
             * @param {$entity.FieldKey} urlKey
             * @param {$entity.FieldKey} textKey
             * @ignore
             */
            init: function (urlKey, textKey) {
                $assertion
                    .isFieldKey(urlKey, "Invalid URL field key")
                    .isFieldKey(textKey, "Invalid text field key");

                /**
                 * Field key that identifies the text
                 * @type {$entity.FieldKey}
                 */
                this.textKey = textKey;

                base.init.call(this);
                $entity.EntityBound.init.call(this);
                $commonWidgets.EntityWidget.init.call(this, urlKey);
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                $commonWidgets.FieldBound.afterAdd.call(this);
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                $commonWidgets.FieldBound.afterRemove.call(this);
            },

            /**
             * Creates default data bound Label widget based on the textKey provided at instantiation.
             * Override to specify custom widget.
             * @returns {$commonWidgets.DataLabel}
             */
            spawnLabelWidget: function () {
                return $commonWidgets.DataLabel.create(this.textKey);
            },

            /**
             * @param {string} fieldValue
             * @returns {$commonWidgets.DataHyperlink}
             * @ignore
             */
            setFieldValue: function (fieldValue) {
                this.setTargetUrl(fieldValue);
                return this;
            }
        });
});
