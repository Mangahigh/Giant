$oop.postpone($data, 'KeyValuePattern', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend(),
        hOP = Object.prototype.hasOwnProperty,
        validators = $assertion.validators;

    /**
     * Instantiates class
     * @name $data.KeyValuePattern.create
     * @function
     * @param {string|object} pattern
     * @example
     * $data.KeyValuePattern.create('|') // matches any key
     * $data.KeyValuePattern.create(['foo', 'bar']) // matches keys 'foo' and 'bar'
     * $data.KeyValuePattern.create('foo<bar^hello') // matches KV pairs 'foo'-'hello' & 'bar'-'hello'
     * @returns {$data.KeyValuePattern}
     */

    /**
     * Matches a key-value pair. A series of key-value patterns make
     * up a query, which then can be used to traverse tree structures with.
     * @class $data.KeyValuePattern
     * @extends $oop.Base
     */
    $data.KeyValuePattern = self
        .addConstants(/** @lends $data.KeyValuePattern */{
            /**
             * Separates keys from values in string pattern
             * @type {string}
             */
            KEY_VALUE_SEPARATOR: '^',

            /**
             * Separates options within the key part of a string pattern
             * @type {string}
             */
            OPTION_SEPARATOR: '<',

            /**
             * Symbol matching all keys
             * @type {string}
             */
            WILDCARD_SYMBOL: '|',

            /**
             * Symbol matching primitive types (non-objects).
             * @type {string}
             */
            PRIMITIVE_SYMBOL: '"',

            /**
             * Symbol indication skip mode during traversal
             * @type {string}
             */
            SKIP_SYMBOL: '\\',

            /** @type {string} */
            MARKER_BRACKET: '[',

            /** @type {string} */
            MARKER_CURLY: '{',

            /**
             * Extracts markers and content from the string representation of a
             * key value pattern. There are two markers: the bracket and curly brace.
             * A marker is valid when and only when the first and last character is a
             * boundary character, and no boundary characters can be found inside the
             * KVP contents. Does not check for validity otherwise.
             * Markers have no meaning on their own. Their meaning is inferred by the
             * mechanism that uses them, eg. tree traversal.
             * @example
             * "{hello^world}"
             * "[|]"
             * @type {RegExp}
             */
            RE_MARKER_EXTRACTOR: /\[([^\[\]]*)\]|{([^{}]*)}|.*/
        })
        .addPrivateMethods(/** @lends $data.KeyValuePattern */{
            /**
             * URI decodes all items of an array.
             * @param {string[]} strings Array of strings
             * @returns {string[]} Array w/ all strings within URI-encoded
             * @private
             */
            _encodeURI: function (strings) {
                var result = [],
                    i;
                for (i = 0; i < strings.length; i++) {
                    result.push(encodeURI(strings[i]));
                }
                return result;
            },

            /**
             * URI decodes all items of an array.
             * @param {string[]} strings Array of URI-encoded strings
             * @returns {string[]} Array w/ all strings URI-decoded
             * @private
             */
            _decodeURI: function (strings) {
                var result = [],
                    i;
                for (i = 0; i < strings.length; i++) {
                    result.push(decodeURI(strings[i]));
                }
                return result;
            },

            /**
             * Expands descriptor from string to object when necesary.
             * @private
             */
            _expandDescriptor: function () {
                var descriptor = this.descriptor;

                if (typeof descriptor === 'string') {
                    // descriptor is simple string
                    // transforming descriptor to object with key wrapped inside
                    this.descriptor = {
                        key: descriptor
                    };
                }
            },

            /**
             * Parses string representation of pattern
             * @param {string} pattern
             * @returns {string|object}
             * @private
             */
            _parseString: function (pattern) {
                var markerDescriptor = pattern.match(self.RE_MARKER_EXTRACTOR),
                    content = markerDescriptor[2] || markerDescriptor[1] || markerDescriptor[0],
                    marker = markerDescriptor[2] || markerDescriptor[1] ?
                        // pattern is marked, taking first character as marker
                        pattern[0] :
                        // pattern is unmarked
                        undefined,
                    keyValue = content.split(self.KEY_VALUE_SEPARATOR),
                    key = keyValue[0],
                    result;

                // processing key part of pattern
                if (key === self.SKIP_SYMBOL) {
                    // skip pattern can't have other attributes
                    return {
                        symbol: key
                    };
                } else if (key === self.WILDCARD_SYMBOL ||
                    key === self.PRIMITIVE_SYMBOL) {
                    // key is a wildcard symbol, matching any key
                    result = {
                        symbol: key
                    };
                } else if (key.indexOf(self.OPTION_SEPARATOR) > -1) {
                    // optional keys matching those keys only
                    result = {
                        options: this._decodeURI(key.split(self.OPTION_SEPARATOR))
                    };
                } else if (keyValue.length === 1 && !marker) {
                    // string literal key, no value
                    return decodeURI(key);
                } else {
                    // string literal key, has value or marker
                    result = {
                        key: decodeURI(key)
                    };
                }

                if (marker) {
                    // adding marker
                    result.marker = marker;
                }

                // processing value part of pattern
                if (keyValue.length > 1) {
                    // pattern has value bundled
                    result.value = decodeURI(keyValue[1]);
                }

                return result;
            }
        })
        .addMethods(/** @lends $data.KeyValuePattern# */{
            /**
             * @param {string|object} pattern
             * @ignore
             */
            init: function (pattern) {
                /**
                 * Pattern descriptor
                 * @type {string|Object}
                 */
                this.descriptor = undefined;

                if (validators.isString(pattern)) {
                    this.descriptor = this._parseString(pattern);
                } else if (pattern instanceof Array) {
                    this.descriptor = {
                        options: pattern
                    };
                } else if (pattern instanceof Object) {
                    this.descriptor = pattern;
                } else {
                    $assertion.assert(false, "Invalid pattern");
                }
            },

            /**
             * Sets value on query pattern. Pattern with a value will only
             * match nodes with the specified value.
             * @param {*} value
             * @returns {$data.KeyValuePattern}
             */
            setValue: function (value) {
                // making sure descriptor is object
                this._expandDescriptor();

                // adding value to descriptor
                this.descriptor.value = value;

                return this;
            },

            /**
             * Tells whether the current pattern is a skipper
             * @returns {boolean}
             */
            isSkipper: function () {
                return this.descriptor.symbol === self.SKIP_SYMBOL;
            },

            /**
             * Returns marker for key value pattern instance.
             * @returns {string}
             */
            getMarker: function () {
                return this.descriptor.marker;
            },

            /**
             * Sets pattern marker.
             * @param {string} marker Left marker boundary. Either '[' or '{'.
             * @returns {$data.KeyValuePattern}
             */
            setMarker: function (marker) {
                $assertion.assert(
                    marker === self.MARKER_BRACKET || marker === self.MARKER_CURLY,
                    "Invalid marker"
                );

                // making sure descriptor is object
                this._expandDescriptor();

                // adding marker to descriptor
                this.descriptor.marker = marker;

                return this;
            },

            /**
             * Determines whether pattern matches specified key
             * @param {string} key
             * @returns {boolean}
             */
            matchesKey: function (key) {
                var descriptor = this.descriptor;

                if (typeof descriptor === 'string') {
                    // descriptor is string, must match by value
                    return descriptor === key;
                } else if (descriptor instanceof Object) {
                    // descriptor is object, properties tell about match
                    if (hOP.call(descriptor, 'symbol')) {
                        // descriptor is wildcard object
                        return descriptor.symbol === self.WILDCARD_SYMBOL ||
                            descriptor.symbol === self.PRIMITIVE_SYMBOL;
                    } else if (hOP.call(descriptor, 'options')) {
                        // descriptor is list of options
                        return descriptor.options.indexOf(key) > -1;
                    } else if (hOP.call(descriptor, 'key')) {
                        return descriptor.key === key;
                    }
                }

                return false;
            },

            /**
             * Determines whether pattern matches specified value.
             * @param {*} value
             * @returns {boolean}
             */
            matchesValue: function (value) {
                var descriptor = this.descriptor;

                if (descriptor.symbol === self.PRIMITIVE_SYMBOL) {
                    // descriptor expects a primitive type value
                    return typeof value !== 'object';
                } else if (typeof descriptor.value !== 'undefined') {
                    // there is a literal value specified in the descriptor
                    // matching against descriptor's value
                    return descriptor.value === value;
                } else {
                    // no value specified in descriptor
                    return true;
                }
            },

            /**
             * Creates string representation of pattern
             * @returns {string}
             */
            toString: function () {
                var descriptor = this.descriptor,
                    result;

                if (typeof descriptor === 'string') {
                    // descriptor is string literal (key only)
                    result = encodeURI(descriptor);
                } else if (descriptor instanceof Object) {
                    // adding key
                    if (hOP.call(descriptor, 'symbol')) {
                        // descriptor contains symbol
                        result = descriptor.symbol;
                    } else if (hOP.call(descriptor, 'options')) {
                        // descriptor contains key options
                        result = self._encodeURI(descriptor.options)
                            .join(self.OPTION_SEPARATOR);
                    } else if (hOP.call(descriptor, 'key')) {
                        // descriptor contains single key
                        result = encodeURI(descriptor.key);
                    }

                    // adding value
                    if (hOP.call(descriptor, 'value')) {
                        result += self.KEY_VALUE_SEPARATOR + encodeURI(descriptor.value);
                    }
                }

                return result;
            }
        });
});

$oop.postpone($data, 'KeyValuePatternCollection', function () {
    "use strict";

    /**
     * Instantiates class
     * @name $data.KeyValuePatternCollection.create
     * @function
     * @returns {$data.KeyValuePatternCollection}
     */

    /**
     * @name $data.KeyValuePatternCollection#descriptor
     * @ignore
     */

    /**
     * @class $data.KeyValuePatternCollection
     * @extends $data.Collection
     * @extends $data.KeyValuePattern
     */
    $data.KeyValuePatternCollection = $data.Collection.of($data.KeyValuePattern);
});

(function () {
    "use strict";

    $assertion.addTypes(/** @lends $data */{
        isKeyValuePattern: function (expr) {
            return $data.KeyValuePattern.isBaseOf(expr);
        },

        isKeyValuePatternOptional: function (expr) {
            return typeof expr === 'undefined' ||
                $data.KeyValuePattern.isBaseOf(expr);
        }
    });

    $oop.extendBuiltIn(String.prototype, /** @lends String# */{
        /**
         * Creates a new KeyValuePattern instance based on the current string.
         * @returns {$data.KeyValuePattern}
         */
        toKeyValuePattern: function () {
            return /** @type {$data.KeyValuePattern} */ $data.KeyValuePattern.create(this);
        },

        /**
         * Shorthand to String.prototype.toKeyValuePattern().
         * Creates a new KeyValuePattern instance based on the current string.
         * @returns {$data.KeyValuePattern}
         */
        toKVP: function () {
            return /** @type {$data.KeyValuePattern} */ $data.KeyValuePattern.create(this);
        }
    });

    $oop.extendBuiltIn(Array.prototype, /** @lends Array# */{
        /**
         * Creates a new KeyValuePattern instance based on the current array.
         * @returns {$data.KeyValuePattern}
         */
        toKeyValuePattern: function () {
            return /** @type {$data.KeyValuePattern} */ $data.KeyValuePattern.create(this);
        },

        /**
         * Shorthand to Array.prototype.toKeyValuePattern().
         * Creates a new KeyValuePattern instance based on the current array.
         * @returns {$data.KeyValuePattern}
         */
        toKVP: function () {
            return /** @type {$data.KeyValuePattern} */ $data.KeyValuePattern.create(this);
        }
    });
}());
