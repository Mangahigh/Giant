$oop.postpone($basicWidgets, 'TemplateText', function (ns, cn) {
    "use strict";

    var base = $basicWidgets.Text,
        self = base.extend(cn)
            .addTraitAndExtend($entity.EntityBound)
            .addTraitAndExtend($i18n.LocaleBound);

    /**
     * @name $basicWidgets.TemplateText.create
     * @function
     * @returns {$basicWidgets.TemplateText}
     */

    /**
     * All-round text widget that handles live templates with localized or
     * field entity parameters.
     * Use sparingly. Give preference to LocaleText and DataText for performance gain.
     * @class
     * @extends $basicWidgets.Text
     * @extends $entity.EntityBound
     * @extends $i18n.LocaleBound
     */
    $basicWidgets.TemplateText = self
        .addPrivateMethods(/** @lends $basicWidgets.TemplateText# */{
            /**
             * Re-subscribes to fields that are stored in template parameters.
             * Not expected to be called frequently.
             * @private
             */
            _updateEntityBindings: function () {
                var contentTemplate = this.contentString,
                    parameterValues = contentTemplate.parameterValues;

                // unbinding from previously bound fields
                $entity.EntityBound.unbindAll.call(this);

                // binding to current unique fields
                $data.Collection.create(parameterValues)
                    .getValues()
                    .concat([contentTemplate.templateString])
                    .toCollection()

                    // getting all field parameters
                    .filterByType($entity.Field)
                    .collectProperty('entityKey')

                    // obtaining unique field keys
                    .toStringDictionary()
                    .reverse()
                    .getKeysAsHash()
                    .toCollection()
                    .callOnEachItem('toFieldKey')

                    // binding to field or document changes
                    .passEachItemTo(
                        this.bindToDelegatedEntityChange, this, 0,
                        'onFieldParameterChange');
            }
        })
        .addMethods(/** @lends $basicWidgets.TemplateText# */{
            /** @ignore */
            init: function () {
                base.init.call(this);
                $entity.EntityBound.init.call(this);
                $i18n.LocaleBound.init.call(this);

                this.elevateMethod('onParameterValuesChange');
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                this.bindToCurrentLocaleReady('onCurrentLocaleReady');
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                this.unbindAll();
            },

            /** @returns {$basicWidgets.TemplateText} */
            unbindAll: function () {
                $i18n.LocaleBound.unbindAll.call(this);
                $entity.EntityBound.unbindAll.call(this);
                return this;
            },

            /**
             * @param {string|$utils.Stringifiable|$templating.LiveTemplate} contentString
             * @returns {$basicWidgets.TemplateText}
             */
            setContentString: function (contentString) {
                var LiveTemplate = $templating.LiveTemplate,
                    contentStringBefore = this.contentString;

                base.setContentString.call(this, contentString);

                if (LiveTemplate.isBaseOf(contentStringBefore)) {
                    // old content string was LiveTemplate
                    // unsubscribing from template parameter changes
                    contentStringBefore.unsubscribeFrom(
                        $templating.EVENT_TEMPLATE_PARAMETER_VALUES_CHANGE,
                        this.onParameterValuesChange);
                }

                if (LiveTemplate.isBaseOf(contentString)) {
                    // new content string is LiveTemplate
                    // subscribing to parameter changes
                    contentString.subscribeTo(
                        $templating.EVENT_TEMPLATE_PARAMETER_VALUES_CHANGE,
                        this.onParameterValuesChange);

                    // re-subscribing to entity changes in parameters
                    this._updateEntityBindings();
                }

                return this;
            },

            /** @ignore */
            onParameterValuesChange: function () {
                this._updateEntityBindings();
                this.reRenderContents();
            },

            /** @ignore */
            onFieldParameterChange: function () {
                this.reRenderContents();
            },

            /** @ignore */
            onCurrentLocaleReady: function () {
                this.reRenderContents();
            }
        });
});