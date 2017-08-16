$oop.postpone($data, 'ValueLink', function () {
    "use strict";

    var base = $data.Link,
        self = base.extend();

    /**
     * Creates a ValueLink instance.
     * @name $data.ValueLink.create
     * @function
     * @returns {$data.ValueLink}
     */

    /**
     * Link that carries a value, and has the option to be unlinked.
     * @class
     * @extends $data.Link
     */
    $data.ValueLink = self
        .addMethods(/** @lends $data.ValueLink# */{
            /** @ignore */
            init: function () {
                base.init.call(this);

                /**
                 * Value associated with link.
                 * @type {*}
                 */
                this.value = undefined;
            },

            /**
             * Sets link value.
             * @param {*} value
             * @returns {$data.ValueLink}
             */
            setValue: function (value) {
                this.value = value;
                return this;
            }
        });
});
