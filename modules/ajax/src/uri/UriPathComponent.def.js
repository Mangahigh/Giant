$oop.postpone($ajax, 'UriPathComponent', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * @name $ajax.UriPathComponent.create
     * @function
     * @param {string} [path]
     * @returns {$ajax.UriPathComponent}
     */

    /**
     * @class
     * @extends $oop.Base
     * @extends $utils.Stringifiable
     * @extends $ajax.UriComponent
     */
    $ajax.UriPathComponent = self
        .addMethods(/** @lends $ajax.UriPathComponent# */{
            /**
             * @param {string} [path]
             * @ignore
             */
            init: function (path) {
                $assertion.isStringOptional(path, "Invalid path component");

                /**
                 * @type {$data.Path}
                 */
                this.path = path ?
                    path.split('/').map(decodeURIComponent).toPath() :
                    [].toPath();
            },

            /**
             * @returns {boolean}
             */
            isEmpty: function () {
                return !this.path.asArray.length;
            },

            /** @returns {string} */
            toString: function () {
                return this.path.asArray
                    .map(encodeURIComponent)
                    .join('/');
            }
        });
});

(function () {
    "use strict";

    $assertion.addTypes(/** @lends $assertion */{
        /** @param {$ajax.UriPathComponent} expr */
        isUriPathComponent: function (expr) {
            return $ajax.UriPathComponent.isBaseOf(expr);
        },

        /** @param {$ajax.UriPathComponent} [expr] */
        isUriPathComponentOptional: function (expr) {
            return typeof expr === 'undefined' ||
                $ajax.UriPathComponent.isBaseOf(expr);
        }
    });

    $oop.extendBuiltIn(String.prototype, /** @lends String# */{
        /**
         * Converts string to a UriPathComponent instance.
         * @returns {$ajax.UriPathComponent}
         */
        toUriPathComponent: function () {
            return $ajax.UriPathComponent.create(this.valueOf());
        }
    });
}());
