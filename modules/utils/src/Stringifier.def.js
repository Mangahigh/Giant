$oop.postpone($utils, 'Stringifier', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * Serializes variables. Returns strings unchanged, converts numbers and booleans to string,
     * calls .toString() on Objects, returns empty string for undefined, null, and functions.
     * @class
     * @extends $oop.Base
     */
    $utils.Stringifier = self
        .addMethods(/** @lends $utils.Stringifier# */{
            /**
             * @param {*} [stringifiable]
             * @returns {string}
             */
            stringify: function (stringifiable) {
                switch (typeof stringifiable) {
                case 'string':
                    return stringifiable;
                case 'object':
                    if (stringifiable instanceof Object) {
                        return stringifiable.toString();
                    } else {
                        return '';
                    }
                    break;
                case 'boolean':
                case 'number':
                    return String(stringifiable);
                default:
                case 'function':
                case 'undefined':
                    return '';
                }
            }
        });
});
