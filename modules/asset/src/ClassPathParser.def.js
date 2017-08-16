$oop.postpone($asset, 'ClassPathParser', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * The ClassPathParser has the sole purpose of parsing class path string expressions.
     * @class
     * @extends $oop.Base
     */
    $asset.ClassPathParser = self
        .addConstants(/** @lends $asset.ClassPathParser */{
            /**
             * @type {RegExp}
             * @constant
             */
            RE_CLASS_PATH_DELIMITER: /[^0-9a-z_$]+/i,

            /**
             * @type {RegExp}
             * @constant
             */
            RE_IDENTIFIER: /^[a-z][0-9a-z_$]+$/i
        })
        .addMethods(/** @lends $asset.ClassPathParser */{
            /**
             * Parses class path. The class path is a path delimited by any character that is
             * not word character, numeric, underscore, or dollar sign.
             * @param {string} classPath
             * @returns {$data.Path}
             */
            parseClassPath: function (classPath) {
                return classPath.split(self.RE_CLASS_PATH_DELIMITER).toPath();
            }
        });
});

$oop.amendPostponed($data, 'Path', function () {
    "use strict";

    $data.Path
        .addMethods(/** @lends $data.Path# */{
            /**
             * Converts Path to a class path string.
             * @returns {string}
             */
            toClassPath: function () {
                return this.asArray
                    .toCollection()
                    .mapValues(function (propertyName, index) {
                        return !$asset.ClassPathParser.RE_IDENTIFIER.test(propertyName) ?
                            '["' + propertyName.replace('"', '\\"') + '"]' :
                            index > 0 ?
                                '.' + propertyName :
                                propertyName;
                    })
                    .items
                    .join('');
            }
        });
});

(function () {
    "use strict";

    $oop.extendBuiltIn(String.prototype, /** @lends String# */{
        /**
         * Converts string to Path, treating the string as class path.
         * @returns {$data.Path}
         */
        toPathFromClassPath: function () {
            return $asset.ClassPathParser.parseClassPath(this);
        }
    });
}());
