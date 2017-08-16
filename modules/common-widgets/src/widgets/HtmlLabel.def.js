$oop.postpone($commonWidgets, 'HtmlLabel', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = $commonWidgets.Label,
        self = base.extend(className);

    /**
     * Creates an HtmlLabel instance.
     * @name $commonWidgets.HtmlLabel.create
     * @function
     * @returns {$commonWidgets.HtmlLabel}
     */

    /**
     * Label that is able to display HTML markup.
     * @class
     * @extends $commonWidgets.Label
     * @deprecated
     * Use $commonWidgets.Label with htmlEscaped set to false.
     */
    $commonWidgets.HtmlLabel = self
        .addMethods(/** @lends $commonWidgets.HtmlLabel# */{
            /** @ignore */
            init: function () {
                base.init.call(this);
                this.htmlEscaped = false;
            }
        });
}, jQuery);
