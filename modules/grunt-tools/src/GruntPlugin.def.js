$oop.postpone($gruntTools, 'GruntPlugin', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * Creates a GruntPlugin instance.
     * GruntPlugin instances may also be created via conversion from String,
     * treating the string as the name of the package.
     * @example
     * $gruntTools.GruntPlugin.create('grunt-contrib-copy')
     * @name $gruntTools.GruntPlugin.create
     * @function
     * @param {string} packageName Name of the NPM package associated with the grunt plugin.
     * @returns {$gruntTools.GruntPlugin}
     * @see String#toGruntPlugin
     */

    /**
     * The GruntPlugin class represents a grunt plugin.
     * @class
     * @extends $oop.Base
     */
    $gruntTools.GruntPlugin = self
        .addMethods(/** @lends $gruntTools.GruntPlugin# */{
            /**
             * @param {string} packageName
             * @ignore
             */
            init: function (packageName) {
                $assertion.isString(packageName, "Invalid package name");

                /**
                 * Name of the NPM package associated with the grunt plugin.
                 * @type {string}
                 */
                this.packageName = packageName;
            },

            /**
             * Loads the grunt plugin via the grunt API.
             * @returns {$gruntTools.GruntPlugin}
             */
            loadPlugin: function () {
                $gruntTools.GruntProxy.create().loadNpmTasks(this.packageName);
                return this;
            }
        });
});

(function () {
    "use strict";

    $oop.extendBuiltIn(String.prototype, /** @lends String# */{
        /**
         * Converts string to GruntPlugin, treating the string as the name of an NPM package.
         * @returns {$gruntTools.AliasTask}
         */
        toGruntPlugin: function () {
            return $gruntTools.GruntPlugin.create(this.valueOf());
        }
    });
}());
