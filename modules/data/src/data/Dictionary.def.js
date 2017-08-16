$oop.postpone($data, 'Dictionary', function () {
    "use strict";

    var base = $data.Hash;

    /**
     * Instantiates class.
     * Constructs a dictionary, initialized with the items passed in the optional argument.
     * @name $data.Dictionary.create
     * @function
     * @param {object} [items]
     * @returns {$data.Dictionary}
     */

    /**
     * Manages key-value pairs. In a dictionary, one item is equivalent to a key-value pair.
     * Internally, `Dictionary` stores key-value pairs in an object hash, its keys being dictionary keys,
     * associated with values or arrays of values.
     * @class $data.Dictionary
     * @extends $data.Hash
     */
    $data.Dictionary = base.extend()
        .addPrivateMethods(/** @lends $data.Dictionary# */{
            /**
             * Counts key-value pairs in dictionary.
             * Since one item may hold multiple values, value count =/= key count.
             * @returns {number}
             * @private
             */
            _countValues: function () {
                var items = this.items,
                    keys = this.getKeys(),
                    result = 0,
                    i, item;

                for (i = 0; i < keys.length; i++) {
                    item = items[keys[i]];
                    result += item instanceof Array ?
                        item.length :
                        1;
                }

                return result;
            }
        })
        .addMethods(/** @lends $data.Dictionary# */{
            /**
             * @param {object} [items]
             * @ignore
             */
            init: function (items) {
                base.init.call(this, items);

                /**
                 * Tracks the number of distinct key-value pairs in the dictionary. Uninitialized until first queried
                 * (by `.getItemCount()`), therefore it is safer to use its getter instead.
                 * Should not be modified externally.
                 * @type {number}
                 */
                this.itemCount = items ? undefined : 0;
            },

            /**
             * Adds key-value pairs to dictionary, where one key, and multiple values may be specified.
             * @example
             * var d = $data.Dictionary.create({foo: "bar"});
             * d.addItem('hello', 'world').items // {foo: "bar", hello: "world"}
             * d.addItem('foo', 'boo').items // {foo: ["bar", "boo"], hello: "world"}
             * @param {string} key Single dictionary key.
             * @param {*|Array} value Value or values to be assigned to the specified key.
             * @returns {$data.Dictionary}
             */
            addItem: function (key, value) {
                var items = this.items,
                    currentValue = items[key],
                    currentValueType = typeof currentValue,
                    valueIsArray = value instanceof Array;

                if (currentValue instanceof Array) {
                    // current item is array
                    if (valueIsArray) {
                        items[key] = currentValue.concat(value);
                    } else {
                        currentValue.push(value);
                    }
                } else if (currentValueType === 'undefined') {
                    // current item does not exist
                    items[key] = valueIsArray ?
                        value.length === 1 ?
                            value[0] :
                            value :
                        value;

                    // updating item count (new key was added)
                    if (typeof this.keyCount === 'number') {
                        this.keyCount++;
                    }
                } else {
                    // current item is single value
                    items[key] = valueIsArray ?
                        [currentValue].concat(value) :
                        [currentValue, value];
                }

                // updating value count
                if (typeof this.itemCount === 'number') {
                    this.itemCount += valueIsArray ?
                        value.length :
                        1;
                }

                return this;
            },

            /**
             * Adds key-value pairs to the dictionary, where multiple keys and values may be specified.
             * All specified keys will be assigned each value listed in `value`.
             * @example
             * var d = $data.Dictionary.create();
             * d.addItems(['hello', 'greetings'], 'world').items // {hello: "world", greetings: "world"}
             * d.addItem(['foo', 'hello'], 'bar').items // {hello: ["world", "bar"], greetings: "world", foo: "bar"}
             * @param {string[]} keys Array of keys.
             * @param {*|Array} value Value or values to be assigned to the specified keys.
             * @returns {$data.Dictionary}
             */
            addItems: function (keys, value) {
                $assertion.isArray(keys, "Invalid keys");

                var i;
                for (i = 0; i < keys.length; i++) {
                    this.addItem(keys[i], value);
                }
                return this;
            },

            /**
             * Removes single key-value pair from dictionary. When `value` is omitted all items matched by `key`
             * will be removed from the dictionary.
             * @example
             * var d = $data.Dictionary.create({
             *     foo: 'bar',
             *     hello: ['world', 'all', 'bar']
             * });
             * d.removeItem('hello', 'bar').items // {foo: 'bar', hello: ['world', 'all']}
             * @param {string} key Key identifying a dictionary item.
             * @param {*} [value] Value (by reference if object) to be removed from the item.
             * @returns {$data.Dictionary}
             */
            removeItem: function (key, value) {
                var items = this.items,
                    currentValue = items[key],
                    currentValueIsArray = currentValue instanceof Array,
                    valueIndex;

                if (currentValueIsArray && typeof value !== 'undefined') {
                    valueIndex = currentValue.indexOf(value);
                    if (valueIndex > -1) {
                        // value is present at specified key
                        if (currentValue.length > 2) {
                            // splicing out value from array
                            currentValue.splice(valueIndex, 1);
                        } else {
                            // replacing array with remaining value
                            items[key] = currentValue[1 - valueIndex];
                        }

                        // updating value counter
                        if (typeof this.itemCount === 'number') {
                            this.itemCount--;
                        }
                    }
                } else {
                    // removing full item
                    delete items[key];

                    // updating counters
                    if (typeof this.keyCount === 'number') {
                        this.keyCount--;
                    }
                    if (typeof this.itemCount === 'number') {
                        this.itemCount -= currentValueIsArray ?
                            currentValue.length :
                            1;
                    }
                }

                return this;
            },

            /**
             * Removes key-value pairs from dictionary matching `value` and any of the keys listed in `key`.
             * When `value` is omitted, all items matching any of `keys` will be removed.
             * @param {string[]} keys Array of keys.
             * @param {*} [value] Value (by reference if object).
             * @returns {$data.Dictionary}
             */
            removeItems: function (keys, value) {
                $assertion.isArray(keys, "Invalid keys");

                var i;
                for (i = 0; i < keys.length; i++) {
                    this.removeItem(keys[i], value);
                }
                return this;
            },

            /**
             * Retrieves the value or values associated with `key`.
             * TODO: make sure single key / array value returns a copy of the array
             * @param {*|Array} key Array of keys matching dictionary items.
             * @returns {*|Array} Array of values matching the specified key(s).
             */
            getItem: function (key) {
                var result,
                    i, item;

                if (typeof key === 'string' ||
                    typeof key === 'number'
                ) {
                    result = this.items[key];
                } else if (key instanceof Array) {
                    // key may be an array of keys
                    result = [];
                    for (i = 0; i < key.length; i++) {
                        item = this.items[key[i]];
                        if (item) {
                            result = result.concat(item);
                        }
                    }
                    if (!result.length) {
                        result = undefined;
                    }
                } else {
                    $assertion.assert(false, "Invalid key");
                }

                return result;
            },

            /**
             * Retrieves the number of items (key-value pairs) in the dictionary.
             * @example
             * var d = $data.Dictionary.create({
             *     foo: 'bar',
             *     hello: ['world', 'all', 'bar']
             * }).getItemCount() // 4
             * @returns {number}
             */
            getItemCount: function () {
                if (typeof this.itemCount !== 'number') {
                    this.itemCount = this._countValues();
                }
                return this.itemCount;
            },

            /**
             * Clones dictionary.
             * @returns {$data.Dictionary}
             */
            clone: function () {
                var result = /** @type {$data.Dictionary} */base.clone.call(this);

                result.itemCount = this.itemCount;

                return result;
            },

            /**
             * Clears dictionary and resets counters.
             * @returns {$data.Dictionary}
             */
            clear: function () {
                // clearing items buffer
                base.clear.call(this);

                // resetting item counter
                this.itemCount = 0;

                return this;
            },

            /**
             * Iterates over dictionary items and calls the specified handler function on each, until
             * either the iteration completes or handler returns `false`.
             * Iteration order is non-deterministic.
             * Iteration commences according to the initial state of the dictionary, with regards to
             * item keys and count. Therefore any handler function changing the dictionary will not thwart the
             * iteration process. However, changing the dictionary while iterating is strongly discouraged.
             * @example
             * d.forEachItem(function (item, itemKey, extraParam) {
             *  alert(itemKey + item + extraParam);
             * }, 'foo'); // outputs: 'foo1foo', 'bar10foo', 'force100foo'
             * @param {function} handler Function to be called on each item. The handler receives current item
             * as first argument, item key as second argument, and all other arguments passed to `.forEachItem()`
             * as the rest of its arguments.
             * @param {object} [context=this] Optional handler context. Set to the dictionary instance by default.
             * @returns {$data.Dictionary}
             */
            forEachItem: function (handler, context) {
                $assertion
                    .isFunction(handler, "Invalid callback function")
                    .isObjectOptional(context, "Invalid context");

                context = context || this;

                var items = this.items,
                    keys = this.getKeys(),
                    keyCount = keys.length,
                    i, itemKey, item,
                    itemCount, j;

                for (i = 0; i < keyCount; i++) {
                    itemKey = keys[i];
                    item = items[itemKey];
                    if (item instanceof Array) {
                        itemCount = item.length;
                        for (j = 0; j < itemCount; j++) {
                            if (handler.call(context, item[j], itemKey) === false) {
                                break;
                            }
                        }
                    } else {
                        if (handler.call(context, item, itemKey) === false) {
                            break;
                        }
                    }
                }

                return this;
            }
        });
});

$oop.amendPostponed($data, 'Hash', function () {
    "use strict";

    $data.Hash.addMethods(/** @lends $data.Hash# */{
        /**
         * Reinterprets hash as a dictionary.
         * @returns {$data.Dictionary}
         */
        toDictionary: function () {
            return $data.Dictionary.create(this.items);
        }
    });
});

(function () {
    "use strict";

    $assertion.addTypes(/** @lends $data */{
        isDictionary: function (expr) {
            return $data.Dictionary.isBaseOf(expr);
        },

        isDictionaryOptional: function (expr) {
            return typeof expr === 'undefined' ||
                $data.Dictionary.isBaseOf(expr);
        }
    });

    $oop.extendBuiltIn(Array.prototype, /** @lends Array# */{
        /**
         * Creates a new Dictionary instance based on the current array.
         * @returns {$data.Dictionary}
         */
        toDictionary: function () {
            return $data.Dictionary.create(this);
        }
    });
}());
