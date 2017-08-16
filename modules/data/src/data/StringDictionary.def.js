$oop.postpone($data, 'StringDictionary', function () {
    "use strict";

    /**
     * Instantiates class.
     * Constructs a dictionary, initialized with the items passed in the optional argument.
     * @name $data.StringDictionary.create
     * @function
     * @param {object|Array} items
     * @returns {$data.StringDictionary}
     */

    /**
     * Dictionary for string values specifically. Methods implemented here expect values to be either strings,
     * or other primitives that can be converted to string implicitly (numbers, booleans, etc.).
     * @example
     * {foo: 'bar', 'hello': ['all', 'the', 'world']}
     * @class $data.StringDictionary
     * @extends $data.Dictionary
     */
    $data.StringDictionary = $data.Dictionary.extend()
        .addMethods(/** @lends $data.StringDictionary# */{
            /**
             * Combines current dictionary with another dictionary and returns the combined dictionary
             * in a new instance. The result will contain values from key-value pairs in the remote dictionary
             * where keys match the current dictionary's values.
             * @example
             * var left = $data.StringDictionary.create({foo: 'bar', hello: ['world', 'all']}),
             *     right = $data.StringDictionary.create({bar: 'BAR', all: 'ALL'});
             * left.combineWith(right).items // {foo: "BAR", hello: "ALL"}
             * @param {$data.Dictionary} remoteDict Remote dictionary (doesn't have to be string dictionary)
             * @returns {$data.Dictionary} Dictionary instance with the combined items. When the two dictionaries
             * (current and remote) are of different (sub)classes, the return value will match the class of the
             * remote dictionary. This way, a `StringDictionary` may be combined with a regular dictionary,
             * resulting in a regular dictionary, but not the other way around.
             */
            combineWith: function (remoteDict) {
                $assertion.isDictionary(remoteDict, "Invalid dictionary");

                var items = this.items,
                    resultBuffer = items instanceof Array ? [] : {},
                    result = /** @type {$data.Dictionary} */ remoteDict.getBase().create(resultBuffer),
                    currentKeys = this.getKeys(),
                    i, currentKey, currentValue, remoteValue;

                for (i = 0; i < currentKeys.length; i++) {
                    currentKey = currentKeys[i];
                    currentValue = this.getItem(currentKey);
                    remoteValue = remoteDict.getItem(currentValue);

                    if (typeof remoteValue !== 'undefined') {
                        result.addItem(currentKey, remoteValue);
                    }
                }

                return result;
            },

            /**
             * Combines current dictionary itself.
             * Equivalent to: `stringDictionary.combineWith(stringDictionary)`.
             * @returns {$data.StringDictionary} New dictionary instance with combined items.
             */
            combineWithSelf: function () {
                return /** @type $data.StringDictionary */ this.combineWith(this);
            },

            /**
             * Flips keys and values in the dictionary and returns the results in a new instance. In the reversed
             * dictionary, keys will be the current dictionary's values and vice versa.
             * @example
             * var d = $data.StringDictionary.create({
             *  foo: 'bar',
             *  hello: ['world', 'all', 'bar']
             * });
             * d.reverse().items // {bar: ["foo", "hello"], world: "hello", all: "hello"}
             * @returns {$data.StringDictionary} New dictionary instance with reversed key-value pairs.
             */
            reverse: function () {
                var resultBuffer = {},
                    result = this.getBase().create(resultBuffer),
                    keys = this.getKeys(),
                    i, key, value;

                for (i = 0; i < keys.length; i++) {
                    key = keys[i];
                    value = this.items[key];

                    // flipping value and key in new dictionary
                    if (value instanceof Array) {
                        result.addItems(value, key);
                    } else {
                        result.addItem(value, key);
                    }
                }

                return result;
            },

            /**
             * Retrieves unique values from dictionary.
             * @returns {string[]}
             */
            getUniqueValues: function () {
                return this
                    .reverse()
                    .getKeys();
            },

            /**
             * Retrieves unique values from dictionary wrapped in a hash.
             * @returns {$data.Hash}
             */
            getUniqueValuesAsHash: function () {
                return this
                    .reverse()
                    .getKeysAsHash();
            }

            /**
             * Clears dictionary and resets counters.
             * @name $data.StringDictionary#clear
             * @function
             * @returns {$data.StringDictionary}
             */
        });
});

$oop.amendPostponed($data, 'Hash', function () {
    "use strict";

    $data.Hash.addMethods(/** @lends $data.Hash# */{
        /**
         * Reinterprets hash as a string dictionary.
         * @returns {$data.StringDictionary}
         */
        toStringDictionary: function () {
            return $data.StringDictionary.create(this.items);
        }
    });
});

(function () {
    "use strict";

    $assertion.addTypes(/** @lends $data */{
        isStringDictionary: function (expr) {
            return $data.StringDictionary.isBaseOf(expr);
        },

        isStringDictionaryOptional: function (expr) {
            return typeof expr === 'undefined' ||
                $data.StringDictionary.isBaseOf(expr);
        }
    });

    $oop.extendBuiltIn(Array.prototype, /** @lends Array# */{
        /**
         * Creates a new StringDictionary instance based on the current array.
         * @returns {$data.StringDictionary}
         */
        toStringDictionary: function () {
            return $data.StringDictionary.create(this);
        }
    });
}());
