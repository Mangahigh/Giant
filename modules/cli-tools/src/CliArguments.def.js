$oop.postpone($cliTools, 'CliArguments', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * @name $cliTools.CliArguments.create
     * @function
     * @param {string[]} [argv]
     * @returns {$cliTools.CliArguments}
     */

    /**
     * Implements CLI argument processing.
     * @class
     * @extends $oop.Base
     */
    $cliTools.CliArguments = self
        .addPrivateMethods(/** @lends $cliTools.CliArguments# */{
            /**
             * @param {string[]} [asArray]
             * @private
             */
            _parseArguments: function (asArray) {
                var argumentChain = $data.OpenChain.create(),
                    arrayLength = asArray && asArray.length || 0,
                    i, cliArgument, cliArgumentLink;

                // adding attributes to chain
                for (i = 0; i < arrayLength; i++) {
                    cliArgument = asArray[i].toCliArgument();
                    cliArgumentLink = $data.ValueLink.create()
                        .setValue(cliArgument);
                    argumentChain.pushLink(cliArgumentLink);
                }

                this.argumentChain = argumentChain;

                this.argumentLookup = asArray ?
                    argumentChain.getValues()
                        .toCollection()
                        .mapKeys(function (cliArgument) {
                            return cliArgument.argumentName;
                        }) :
                    $data.Collection.create();
            }
        })
        .addMethods(/** @lends $cliTools.CliArguments# */{
            /**
             * @param {string[]} asArray
             * @ignore
             */
            init: function (asArray) {
                $assertion.isArrayOptional(asArray, "Invalid CLI arguments");

                /**
                 * Stores associations between argument names and corresponding argument instances.
                 * @type {$data.Collection}
                 */
                this.argumentLookup = undefined;

                /**
                 * Stores argument instances in a chain structure.
                 * @type {$data.OpenChain}
                 */
                this.argumentChain = undefined;

                /**
                 * Expected arguments. Contains default values.
                 * @type {$cliTools.CliExpectedArguments}
                 */
                this.expectedArguments = undefined;

                this._parseArguments(asArray);
            },

            /**
             * @param {$cliTools.CliExpectedArguments} expectedArguments
             * @returns {$cliTools.CliArguments}
             */
            setExpectedArguments: function (expectedArguments) {
                this.expectedArguments = expectedArguments;
                return this;
            },

            /**
             * Appends a single argument to the list of arguments.
             * @param {$cliTools.CliArgument} cliArgument
             * @returns {$cliTools.CliArguments}
             */
            appendArgument: function (cliArgument) {
                this.argumentChain.pushValue(cliArgument);
                this.argumentLookup.setItem(cliArgument.argumentName, cliArgument);
                return this;
            },

            /**
             * Appends multiple arguments to the list of arguments.
             * @param {$cliTools.CliArguments} cliArguments
             * @returns {$cliTools.CliArguments}
             */
            appendArguments: function (cliArguments) {
                var that = this;

                cliArguments.argumentChain
                    .forEachLink(function (/**$data.ValueLink*/link) {
                        that.appendArgument(link.value);
                    });

                return this;
            },

            /**
             * Returns the number of arguments in the collection.
             * @returns {number}
             */
            getArgumentCount: function () {
                return this.argumentLookup.getKeyCount();
            },

            /**
             * Retrieves the value of the specified argument.
             * @param {string} argumentName
             * @returns {string|boolean}
             */
            getArgumentValue: function (argumentName) {
                var expectedArguments = this.expectedArguments,
                    expectedArgument = expectedArguments && expectedArguments.getItem(argumentName),
                    argument = this.argumentLookup.getItem(argumentName);

                return argument && argument.argumentValue ||
                    expectedArgument && expectedArgument.defaultValue;
            },

            /**
             * Returns an array of each argument serialized.
             * @returns {string[]}
             */
            getAsArray: function () {
                return this.argumentChain
                    .getValues()
                    .toCollection()
                    .callOnEachItem('toString')
                    .items;
            },

            /**
             * Serializes entire argument list.
             * @returns {string}
             */
            toString: function () {
                return this.argumentChain
                    .getValues()
                    .toCollection()
                    .callOnEachItem('toString')
                    .items
                    .join(' ');
            }
        });
});

(function () {
    "use strict";

    $oop.extendBuiltIn(Array.prototype, /** @lends Array# */{
        /**
         * @returns {$cliTools.CliArguments}
         */
        toCliArguments: function () {
            return $cliTools.CliArguments.create(this);
        }
    });
}());
