$oop.postpone($data, 'OpenChain', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * Creates an OpenChain instance.
     * @name $data.OpenChain.create
     * @function
     * @returns {$data.OpenChain}
     */

    /**
     * Chain data structure with two fixed ends and value carrying links in between.
     * OpenChain behaves like a stack in that you may append and prepend the chain
     * using a stack-like API. (push, pop, etc.)
     * @class
     * @extends $oop.Base
     */
    $data.OpenChain = self
        .addMethods(/** @lends $data.OpenChain# */{
            /** @ignore */
            init: function () {
                /**
                 * First (fixed) link in the chain.
                 * @type {$data.ValueLink}
                 */
                this.firstLink = $data.Link.create()
                    .setParentChain(this);

                /**
                 * Last (fixed) link in the chain.
                 * @type {$data.ValueLink}
                 */
                this.lastLink = $data.Link.create()
                    .addAfter(this.firstLink);
            },

            /**
             * Adds link at the end of the chain.
             * @param {$data.Link} link
             */
            pushLink: function (link) {
                link.addBefore(this.lastLink);
                return this;
            },

            /**
             * Adds new link with the specified value at the end of the chain.
             * @param {*} value
             * @returns {$data.OpenChain}
             */
            pushValue: function (value) {
                this.pushLink($data.ValueLink.create()
                    .setValue(value));
                return this;
            },

            /**
             * Removes link from the end of the chain and returns removed link.
             * @returns {$data.Link}
             */
            popLink: function () {
                return this.lastLink.previousLink
                    .unlink();
            },

            /**
             * Adds link at the start of the chain.
             * @param {$data.Link} link
             */
            unshiftLink: function (link) {
                link.addAfter(this.firstLink);
                return this;
            },

            /**
             * Adds new link with the specified value at the start of the chain.
             * @param {*} value
             * @returns {$data.OpenChain}
             */
            unshiftValue: function (value) {
                this.unshiftLink($data.ValueLink.create()
                    .setValue(value));
                return this;
            },

            /**
             * Removes link from the start of the chain and returns removed link.
             * @returns {$data.Link}
             */
            shiftLink: function () {
                return this.firstLink.nextLink
                    .unlink();
            },

            /**
             * Iterates over links from first to last and calls the specified function
             * passing the current link to it.
             * @param {function} handler
             * @param {object} [context=this]
             * @returns {$data.OpenChain}
             */
            forEachLink: function (handler, context) {
                $assertion
                    .isFunction(handler, "Invalid callback function")
                    .isObjectOptional(context, "Invalid context");

                var link = this.firstLink.nextLink,
                    i = 0;

                while (link !== this.lastLink) {
                    if (handler.call(context || this, link, i++) === false) {
                        break;
                    }
                    link = link.nextLink;
                }

                return this;
            },

            /**
             * Retrieves the chain's links as an array.
             * O(n) complexity.
             * @returns {Array}
             */
            getLinks: function () {
                var link = this.firstLink.nextLink,
                    result = [];

                while (link !== this.lastLink) {
                    result.push(link);
                    link = link.nextLink;
                }

                return result;
            },

            /**
             * Retrieves the values stored in the chain's links as an array.
             * O(n) complexity.
             * @returns {Array}
             */
            getValues: function () {
                var link = this.firstLink.nextLink,
                    result = [];

                while (link !== this.lastLink) {
                    result.push(link.value);
                    link = link.nextLink;
                }

                return result;
            }
        });
});
