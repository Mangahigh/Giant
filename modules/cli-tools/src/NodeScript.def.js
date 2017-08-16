$oop.postpone($cliTools, 'NodeScript', function () {
    "use strict";

    var base = $cliTools.CliApplication,
        self = base.extend();

    /**
     * @name $cliTools.NodeScript.create
     * @function
     * @param {string} scriptPath
     * @returns {$cliTools.NodeScript}
     */

    /**
     * @class
     * @extends $cliTools.CliApplication
     */
    $cliTools.NodeScript = self
        .addConstants(/** @lends $cliTools.NodeScript */{
            /**
             * @type {RegExp}
             * @constant
             */
            RE_JAVASCRIPT_PATH: /.*\.js$/
        })
        .addMethods(/** @lends $cliTools.NodeScript# */{
            /**
             * @param {string} scriptPath
             * @ignore
             */
            init: function (scriptPath) {
                $assertion.assert(self.RE_JAVASCRIPT_PATH.test(scriptPath), "Invalid node script path");

                base.init.call(this, 'node');

                /** @type {string} */
                this.scriptPath = scriptPath;
            },

            /**
             * @param {$cliTools.CliArguments} cliArguments
             * @param {object} [processOptions]
             * @returns {$utils.Promise}
             */
            runCli: function (cliArguments, processOptions) {
                return base.runCli.call(
                    this,
                    // appending arguments to script path
                    [this.scriptPath].toCliArguments()
                        .appendArguments(cliArguments),
                    processOptions);
            }
        });
});

$oop.amendPostponed($cliTools, 'CliApplication', function () {
    "use strict";

    $cliTools.CliApplication
        .addSurrogate($cliTools, 'NodeScript', function (applicationPath) {
            return $cliTools.NodeScript.RE_JAVASCRIPT_PATH.test(applicationPath);
        });
});
