$oop.postpone($data, 'OrderedStringList', function () {
    "use strict";

    /**
     * Instantiates class.
     * @name $data.OrderedStringList.create
     * @function
     * @param {string[]} [items] Initial values. Array of strings.
     * @param {string} [orderType='ascending'] Order type. Either 'ascending' or 'descending'.
     * @returns {$data.OrderedStringList}
     */

    /**
     * Ordered list extended with string-specific fast, prefix-based search.
     * @class $data.OrderedStringList
     * @extends $data.OrderedList
     */
    $data.OrderedStringList = $data.OrderedList.extend()
        .addPrivateMethods(/** @lends $data.OrderedStringList */{
            /**
             * Calculates range search end value for prefix search based on start value.
             * Increments char code on the string's last character.
             * @param {string} startValue
             * @returns {String} Calculated end value
             * @private
             */
            _getEndValue: function (startValue) {
                return startValue.slice(0, -1) + String.fromCharCode(startValue.substr(-1).charCodeAt(0) + 1);
            },

            /**
             * Returns lowest value string that is higher than the input.
             * @param {string} startValue
             * @returns {string}
             * @private
             */
            _getNextValue: function (startValue) {
                return startValue + String.fromCharCode(0);
            }
        })
        .addMethods(/** @lends $data.OrderedStringList# */{
            /**
             * Retrieves items from the list matching the specified prefix.
             * @example
             * var osl = $data.OrderedStringList(['hi', 'hello', 'hire', 'foo']);
             * osl.getRangeByPrefix('hi') // ['hi', 'hire']
             * osl.getRangeByPrefix('h') // ['hello', 'hi', 'hire']
             * @param {string} prefix Prefix to be matched by list items.
             * @param {boolean} [excludeOriginal=false] Whether to exclude `prefix` from the results
             * @param {number} [offset=0] Number of items to skip at start.
             * @param {number} [limit=Infinity] Number of items to fetch at most.
             * @returns {string[]} Sorted array of matches.
             */
            getRangeByPrefix: function (prefix, excludeOriginal, offset, limit) {
                $assertion
                    .assert(typeof prefix === 'string' && prefix.length > 0, "Empty prefix")
                    .isBooleanOptional(excludeOriginal);

                var startValue = excludeOriginal ?
                        this._getNextValue(prefix) :
                        prefix,
                    endValue = this._getEndValue(prefix);

                return this.getRange(startValue, endValue, offset, limit);
            },

            /**
             * Retrieves items from the list matching the specified prefix, wrapped in a hash.
             * @param {string} prefix Prefix to be matched by list items.
             * @param {boolean} [excludeOriginal=false] Whether to exclude `prefix` from the results
             * @param {number} [offset=0] Number of items to skip at start.
             * @param {number} [limit=Infinity] Number of items to fetch at most.
             * @returns {$data.Hash}
             * @see $data.OrderedList#getRange
             */
            getRangeByPrefixAsHash: function (prefix, excludeOriginal, offset, limit) {
                var range = this.getRangeByPrefix.apply(this, arguments);
                return $data.Hash.create(range);
            },

            /**
             * Removes all occurrences of a specific string from the list.
             * @example
             * var osl = $data.OrderedStringList(['hi', 'hello', 'hire', 'hi', 'foo']);
             * osl.removeAll('hi').items // ['hello', 'hire', 'foo']
             * @param {string} value String value to be removed from list.
             * @returns {$data.OrderedStringList}
             */
            removeEvery: function (value) {
                $assertion.isString(value);
                this.removeRange(value, this._getNextValue(value));
                return this;
            }
        });
});

$oop.amendPostponed($data, 'Hash', function () {
    "use strict";

    $data.Hash.addMethods(/** @lends $data.Hash# */{
        /**
         * Converts Hash to OrderedStringList instance.
         * @param {string} [orderType='ascending']
         * @returns {$data.OrderedStringList}
         */
        toOrderedStringList: function (orderType) {
            return $data.OrderedStringList.create(this.items, orderType);
        }
    });
});

(function () {
    "use strict";

    $oop.extendBuiltIn(Array.prototype, /** @lends Array# */{
        /**
         * Creates a new OrderedStringList instance based on the current array.
         * @param {string} [orderType='ascending']
         * @returns {$data.OrderedStringList}
         */
        toOrderedStringList: function (orderType) {
            return $data.OrderedStringList.create(this, orderType);
        }
    });
}());
