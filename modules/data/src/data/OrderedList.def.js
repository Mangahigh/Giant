$oop.postpone($data, 'OrderedList', function () {
    "use strict";

    var base = $data.Hash;

    /**
     * Instantiates class.
     * Sets the list up with initial items.
     * @name $data.OrderedList.create
     * @function
     * @param {string[]|number[]} [items] Initial values: array of strings or numbers.
     * @param {string} [orderType='ascending'] Order type. Either 'ascending' or 'descending'.
     * @returns {$data.OrderedList}
     */

    /**
     * Manages a list of strings or numbers and keeps it prepared for quick access and queries.
     * @class $data.OrderedList
     * @extends $data.Hash
     */
    $data.OrderedList = base.extend()
        .addConstants(/** @lends $data.OrderedList */{
            /**
             * @type {object}
             * @constant
             */
            orderTypes: {
                ascending : 'ascending',
                descending: 'descending'
            }
        })
        .addPrivateMethods(/** @lends $data.OrderedList# */{
            /**
             * Compares numbers in ascending order. To be supplied to Array.sort().
             * @private
             * @memberOf $data.OrderedList
             */
            _compareAscending: function (a, b) {
                return a > b ? 1 : a < b ? -1 : 0;
            },

            /**
             * Compares numbers in descending order. To be supplied to Array.sort().
             * @private
             * @memberOf $data.OrderedList
             */
            _compareDescending: function (a, b) {
                return b > a ? 1 : b < a ? -1 : 0;
            },

            /**
             * Gets splice index for ascending order.
             * @param {string|number} value
             * @param {number} start
             * @param {number} end
             * @returns {number}
             * @private
             */
            _spliceIndexOfAsc: function (value, start, end) {
                var items = this.items,
                    medianPos = Math.floor((start + end) / 2), // position of the median within range
                    medianValue = items[medianPos]; // median value within range

                if (items[start] >= value) {
                    // out of range hit
                    return start;
                } else if (end - start <= 1) {
                    // between two adjacent values
                    return end;
                } else if (medianValue >= value) {
                    // narrowing range to lower half
                    return this._spliceIndexOfAsc(value, start, medianPos);
                } else if (medianValue < value) {
                    // narrowing range to upper half
                    return this._spliceIndexOfAsc(value, medianPos, end);
                }

                // default index, should never be reached
                return -1;
            },

            /**
             * Gets splice index for descending order.
             * Same as $data.OrderedList#_spliceIndexOfAsc but with value comparisons flipped.
             * @param {string|number} value
             * @param {number} start
             * @param {number} end
             * @returns {number}
             * @private
             * @see $data.OrderedList#_spliceIndexOfAsc
             */
            _spliceIndexOfDesc: function (value, start, end) {
                var items = this.items,
                    medianPos = Math.floor((start + end) / 2), // position of the median within range
                    medianValue = items[medianPos]; // median value within range

                if (items[start] <= value) {
                    // out of range hit
                    return start;
                } else if (end - start <= 1) {
                    // between two adjacent values
                    return end;
                } else if (medianValue <= value) {
                    // narrowing range to lower half
                    return this._spliceIndexOfDesc(value, start, medianPos);
                } else if (medianValue > value) {
                    // narrowing range to upper half
                    return this._spliceIndexOfDesc(value, medianPos, end);
                }

                // default index, should never be reached
                return -1;
            }
        })
        .addMethods(/** @lends $data.OrderedList# */{
            /**
             * @param {string[]|number[]} [items]
             * @param {boolean} [orderType='ascending']
             * @ignore
             */
            init: function (items, orderType) {
                $assertion
                    .isArrayOptional(items, "Invalid items")
                    .isOrderTypeOptional(orderType, "Invalid order type");

                // preparing items buffer
                items = items || [];
                if (items.length) {
                    // sorting items
                    items.sort(orderType === this.orderTypes.descending ?
                        this._compareDescending :
                        this._compareAscending);
                }

                /**
                 * @name $data.OrderedList#items
                 * @type {string[]|number[]}
                 */

                base.init.call(this, items);

                /**
                 * Whether list is ordered ascending or descending.
                 * @type {string}
                 */
                this.orderType = orderType || this.orderTypes.ascending;
            },

            //////////////////////////////
            // Querying

            /**
             * Performs binary search on the list's sorted array buffer and returns the lowest index where
             * a given value would be spliced into or out of the list. For exact hits, this is the actual position,
             * but no information is given whether the value is present in the list or not.
             * @example
             * var ol = $data.OrderedList.create(['foo', 'bar', 'bee']);
             * ol.spliceIndexOf('bee') // 1
             * ol.spliceIndexOf('ban') // 0
             * ol.spliceIndexOf('fun') // 3
             * @param {string|number} value List item value.
             * @param {number} [start=0] Start position of search range. Default: 0.
             * @param {number} [end] Ending position of search range. Default: this.items.length - 1.
             * @returns {number}
             */
            spliceIndexOf: function (value, start, end) {
                start = start || 0;
                end = end || this.items.length;

                var orderTypes = this.orderTypes;

                switch (this.orderType) {
                case orderTypes.descending:
                    return this._spliceIndexOfDesc(value, start, end);
                case orderTypes.ascending:
                    return this._spliceIndexOfAsc(value, start, end);
                default:
                    // should not be reached - order is either ascending or descending
                    return -1;
                }
            },

            /**
             * Returns list items in a sorted array starting from `startValue` up to but not including `endValue`.
             * @example
             * var ol = $data.OrderedList.create(['foo', 'bar', 'ban', 'bee']);
             * ol.getRange('bar', 'foo') // ['bar', 'bee', 'foo']
             * ol.getRange('a', 'bee') // ['ban', 'bar', 'bee']
             * ol.getRange('foo', 'fun') // ['foo']
             * @param {string|number} startValue Value marking start of the range.
             * @param {string|number} endValue Value marking end of the range.
             * @param {number} [offset=0] Number of items to skip at start.
             * @param {number} [limit=Infinity] Number of items to fetch at most.
             * @returns {Array} Shallow copy of the array's affected segment.
             */
            getRange: function (startValue, endValue, offset, limit) {
                offset = offset || 0;
                limit = typeof limit === 'undefined' ? Infinity : limit;

                var startIndex = this.spliceIndexOf(startValue),
                    endIndex = this.spliceIndexOf(endValue);

                return this.items.slice(startIndex + offset, Math.min(endIndex, startIndex + offset + limit));
            },

            /**
             * Retrieves a range of values and wraps it in a Hash object.
             * @param {string|number} startValue Value marking start of the range.
             * @param {string|number} endValue Value marking end of the range.
             * @param {number} [offset=0] Number of items to skip at start.
             * @param {number} [limit=Infinity] Number of items to fetch at most.
             * @returns {$data.Hash} Hash with a shallow copy of the array's affected segment.
             * @see $data.OrderedList#getRange
             */
            getRangeAsHash: function (startValue, endValue, offset, limit) {
                var range = this.getRange.apply(this, arguments);
                return $data.Hash.create(range);
            },

            //////////////////////////////
            // Content manipulation

            /**
             * Adds a single value to the list and returns the position where the value was inserted.
             * @example
             * var ol = $data.OrderedList.create(['b', 'c']);
             * var pos = ol.addItem('a');
             * pos // 0
             * ol.items // ['a', 'b', 'c']
             * @param {string|number} value Value to be inserted.
             * @returns {number} Array index of the inserted item.
             */
            addItem: function (value) {
                var spliceIndex = this.spliceIndexOf(value);
                this.items.splice(spliceIndex, 0, value);
                return spliceIndex;
            },

            /**
             * Adds multiple values to the list.
             * @param {string[]|number[]} values Array of values to be inserted.
             * @returns {$data.OrderedList}
             */
            addItems: function (values) {
                $assertion.isArray(values, "Invalid item values");
                var i;
                for (i = 0; i < values.length; i++) {
                    this.addItem(values[i]);
                }
                return this;
            },

            /**
             * Removes the first available item matching the value and returns the affected position.
             * Returns -1 when the value is not present in the list.
             * @example
             * var ol = $data.OrderedList.create(['b', 'c', 'a']);
             * var pos = ol.removeItem('b');
             * pos // 1
             * ol.items // ['a', 'c']
             * @param {string|number} value Value to be removed.
             * @returns {number} The index from which the item was removed. -1 if item was not present.
             */
            removeItem: function (value) {
                var items = this.items,
                    spliceIndex = this.spliceIndexOf(value);

                // must check whether value is present
                if (items[spliceIndex] === value) {
                    items.splice(spliceIndex, 1);
                } else {
                    spliceIndex = -1;
                }

                return spliceIndex;
            },

            /**
             * Removes all items specified in `values`.
             * @param {string[]|number[]} values Array of values to be removed.
             * @returns {$data.OrderedList}
             */
            removeItems: function (values) {
                $assertion.isArray(values, "Invalid item values");
                var i;
                for (i = 0; i < values.length; i++) {
                    this.removeItem(values[i]);
                }
                return this;
            },

            /**
             * Removes a range from the list starting from startValue up to but not including endValue, and
             * returns the index at which actual removal began.
             * Neither `startValue` nor `endValue` has to be present in the list.
             * @param {string|number} startValue Lower bound for range.
             * @param {string|number} endValue Upper bound for range.
             * @returns {number} Actual starting index of removal. -1 if no item matched the specified range.
             */
            removeRange: function (startValue, endValue) {
                var startIndex = this.spliceIndexOf(startValue),
                    endIndex = this.spliceIndexOf(endValue),
                    length = endIndex - startIndex;

                if (length > 0) {
                    this.items.splice(startIndex, length);
                    return startIndex;
                } else {
                    return -1;
                }
            },

            /**
             * Clones OrderedList instance, setting the correct orderType property.
             * @returns {$data.OrderedList}
             */
            clone: function () {
                var result = base.clone.call(this);

                // copying over order type
                result.orderType = this.orderType;

                return result;
            }

            /**
             * Clears the list.
             * @name $data.OrderedList#clear
             * @function
             * @returns {$data.OrderedList}
             */
        });
});

$oop.amendPostponed($data, 'Hash', function () {
    "use strict";

    $data.Hash.addMethods(/** @lends $data.Hash# */{
        /**
         * Converts Hash to OrderedList instance.
         * @param {string} [orderType='ascending']
         * @returns {$data.OrderedList}
         */
        toOrderedList: function (orderType) {
            return $data.OrderedList.create(this.items, orderType);
        }
    });
});

(function () {
    "use strict";

    $assertion.addTypes(/** @lends $data */{
        /** @param {string} expr */
        isOrderType: function (expr) {
            return expr && $data.OrderedList.orderTypes[expr] === expr;
        },

        /** @param {string} [expr] */
        isOrderTypeOptional: function (expr) {
            return $data.OrderedList.orderTypes[expr] === expr;
        }
    });

    $oop.extendBuiltIn(Array.prototype, /** @lends Array# */{
        /**
         * Creates a new OrderedList instance based on the current array.
         * @param {string} [orderType='ascending']
         * @returns {$data.OrderedList}
         */
        toOrderedList: function (orderType) {
            return $data.OrderedList.create(this, orderType);
        }
    });
}());
