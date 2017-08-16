$oop.postpone($commonWidgets, 'Page', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = $widget.Widget,
        self = base.extend(className)
            .addTraitAndExtend($commonWidgets.BinaryStateful)
            .addTrait($commonWidgets.Disableable);

    /**
     * Creates a Page instance.
     * @name $commonWidgets.Page.create
     * @function
     * @returns {$commonWidgets.Page}
     */

    /**
     * The Page class endows all pages with basic features, such as
     * adding relevant CSS classes to the <em>body</em> element.
     * Subclass to create page classes, and add them to he hierarchy as root.
     * @example
     * MyPage.create().setRootWidget();
     * @class
     * @extends $widget.Widget
     * @extends $commonWidgets.BinaryStateful
     * @extends $commonWidgets.Disableable
     */
    $commonWidgets.Page = self
        .addPrivateMethods(/** @lends $commonWidgets.Page# */{
            /**
             * @returns {$data.Collection}
             * @private
             */
            _getPageCssClasses: function () {
                return this.getBase().htmlAttributes.cssClasses
                    .mapValues(function (refCount, className) {
                        return 'page-' + className;
                    });
            }
        })
        .addMethods(/** @lends $commonWidgets.Page# */{
            /** @ignore */
            init: function () {
                base.init.call(this);
                $commonWidgets.BinaryStateful.init.call(this);
                $commonWidgets.Disableable.init.call(this);
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                $commonWidgets.BinaryStateful.afterAdd.call(this);

                var documentBody = $commonWidgets.DocumentBody.create();

                this._getPageCssClasses()
                    .passEachItemTo(documentBody.addCssClass, documentBody);
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                $commonWidgets.BinaryStateful.afterRemove.call(this);

                var documentBody = $commonWidgets.DocumentBody.create();

                this._getPageCssClasses()
                    .passEachItemTo(documentBody.decreaseCssClassRefCount, documentBody);
            }
        });
}, jQuery);
