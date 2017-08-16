/*jshint node:true */
$oop.postpone($cliTools, 'Argv', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * @name $cliTools.Argv.create
     * @function
     * @returns {$cliTools.Argv}
     */

    /**
     * @class
     * @extends $oop.Base
     */
    $cliTools.Argv = self
        .addMethods(/** @lends $cliTools.Argv# */{
            /**
             * @param {string[]} argv
             * @ignore
             */
            init: function (argv) {
                $assertion.isArray(argv, "Invalid argv");

                /**
                 * Process argument list.
                 * @type {string[]}
                 */
                this.argv = argv;
            },

            /**
             * Converts Argv instance to CliArguments.
             * The result will only contain user arguments passed to the script.
             * @returns {$cliTools.CliArguments}
             */
            toCliArguments: function () {
                // removing first 2 arguments
                return this.argv.slice(2).toCliArguments();
            }
        });
});

(function () {
    "use strict";

    $oop.extendBuiltIn(Array.prototype, /** @lends Array# */{
        /**
         * Converts the array into an Argv instance.
         * @returns {$cliTools.Argv}
         */
        toArgv: function () {
            return $cliTools.Argv.create(this);
        }
    });
}());
