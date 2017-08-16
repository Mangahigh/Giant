$oop.postpone($cliTools, 'CliFlag', function () {
    "use strict";

    var base = $cliTools.CliArgument,
        self = base.extend();

    /**
     * @name $cliTools.CliFlag.create
     * @function
     * @param {string} [argumentStr]
     * @returns {$cliTools.CliFlag}
     */

    /**
     * @class
     * @extends $cliTools.CliArgument
     */
    $cliTools.CliFlag = self
        .addMethods(/** @lends $cliTools.CliFlag# */{
            /**
             * @param {string} [argumentStr]
             * @ignore
             */
            init: function (argumentStr) {
                base.init.call(this, argumentStr);

                this.argumentName = argumentStr;
                this.argumentValue = true;
            },

            /**
             * Converts CLI flag back to string.
             * @returns {string}
             */
            toString: function () {
                return this.argumentName;
            }
        });
});

$oop.amendPostponed($cliTools, 'CliArgument', function () {
    "use strict";

    $cliTools.CliArgument
        .addSurrogate($cliTools, 'CliFlag', function (argumentStr) {
            return typeof argumentStr === 'string' && !$cliTools.CliOption.RE_OPTION.test(argumentStr);
        });
});
