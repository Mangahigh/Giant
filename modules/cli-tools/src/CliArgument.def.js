$oop.postpone($cliTools, 'CliArgument', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * @name $cliTools.CliArgument.create
     * @function
     * @param {string} [argumentStr]
     * @returns {$cliTools.CliArgument}
     */

    /**
     * Represents a single argument of a CLI application, which is
     * either interpreted as a command / flag, or an option.
     * @class
     * @extends $oop.Base
     */
    $cliTools.CliArgument = self
        .addMethods(/** @lends $cliTools.CliArgument# */{
            /**
             * @param {string} [argumentStr]
             * @ignore
             */
            init: function (argumentStr) {
                $assertion.isStringOptional(argumentStr, "Invalid CLI argument string");

                /**
                 * Option name.
                 * @type {string}
                 */
                this.argumentName = undefined;

                /**
                 * Option value.
                 * @type {string}
                 */
                this.argumentValue = undefined;
            },

            /**
             * @param {string} argumentName
             * @returns {$cliTools.CliArgument}
             */
            setArgumentName: function (argumentName) {
                this.argumentName = argumentName;
                return this;
            },

            /**
             * @param {string} argumentValue
             * @returns {$cliTools.CliArgument}
             */
            setArgumentValue: function (argumentValue) {
                this.argumentValue = argumentValue;
                return this;
            }
        });
});

(function () {
    "use strict";

    $oop.extendBuiltIn(String.prototype, /** @lends String# */{
        /**
         * @returns {$cliTools.CliArgument}
         */
        toCliArgument: function () {
            return $cliTools.CliArgument.create(this);
        }
    });
}());
