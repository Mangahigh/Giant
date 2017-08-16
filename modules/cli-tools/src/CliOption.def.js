$oop.postpone($cliTools, 'CliOption', function () {
    "use strict";

    var base = $cliTools.CliArgument,
        self = base.extend();

    /**
     * @name $cliTools.CliOption.create
     * @function
     * @param {string} [argumentStr]
     * @returns {$cliTools.CliOption}
     */

    /**
     * @class
     * @extends $cliTools.CliArgument
     */
    $cliTools.CliOption = self
        .addConstants(/** @lends CliOption */{
            /**
             * Defines the pattern an option must adhere to.
             * @constant
             */
            RE_OPTION: /--([^=]+)=(.*)/
        })
        .addMethods(/** @lends $cliTools.CliOption# */{
            /**
             * @param {string} [argumentStr]
             * @ignore
             */
            init: function (argumentStr) {
                base.init.call(this, argumentStr);

                var keyValuePair = argumentStr && self.RE_OPTION.exec(argumentStr);

                $assertion.assert(keyValuePair, "Malformed option string");

                this.argumentName = keyValuePair[1];
                this.argumentValue = keyValuePair[2];
            },

            /**
             * Converts CLI option back to string.
             * @returns {string}
             */
            toString: function () {
                return ['--', this.argumentName, '=', this.argumentValue].join('');
            }
        });
});

$oop.amendPostponed($cliTools, 'CliArgument', function () {
    "use strict";

    $cliTools.CliArgument
        .addSurrogate($cliTools, 'CliOption', function (argumentStr) {
            return $cliTools.CliOption.RE_OPTION.test(argumentStr);
        });
});
