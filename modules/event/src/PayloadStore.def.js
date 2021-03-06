$oop.postpone($event, 'PayloadStore', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * @name $event.PayloadStore.create
     * @function
     * @returns {$event.PayloadStore}
     */

    /**
     * Stores event payload items indexed by event name and item name.
     * @class
     * @extends $oop.Base
     */
    $event.PayloadStore = self
        .addMethods(/** @lends $event.PayloadStore# */{
            /** @ignore */
            init: function () {
                /**
                 * @type {$data.Tree}
                 */
                this.payloads = $data.Tree.create();
            },

            /**
             * Associates a payload item with an event name.
             * Subsequent events by the specified name will carry the specified payload item.
             * @param {string} eventName
             * @param {string} payloadItemName
             * @param {*} payloadItemValue
             */
            setPayloadItem: function (eventName, payloadItemName, payloadItemValue) {
                this.payloads.setNode([eventName, payloadItemName].toPath(), payloadItemValue);
                return this;
            },

            /**
             * Associates multiple payload items with an event name.
             * @param {string} eventName
             * @param {object} payload
             */
            setPayloadItems: function (eventName, payload) {
                var payloads = this.payloads,
                    payloadItemNames = Object.keys(payload),
                    i, payloadItemName;

                for (i = 0; i < payloadItemNames.length; i++) {
                    payloadItemName = payloadItemNames[i];
                    payloads.setNode([eventName, payloadItemName].toPath(), payload[payloadItemName]);
                }

                return this;
            },

            /**
             * Dissociates a payload item from an event name.
             * @param {string} eventName
             * @param {string} payloadItemName
             */
            deletePayloadItem: function (eventName, payloadItemName) {
                this.payloads.unsetKey([eventName, payloadItemName].toPath());
                return this;
            },

            /**
             * Dissociates multiple payload items from an event name.
             * Pass item names following the first argument.
             * @param {string} eventName
             */
            deletePayloadItems: function (eventName) {
                var payloads = this.payloads,
                    i, payloadItemName;

                for (i = 1; i < arguments.length; i++) {
                    payloadItemName = arguments[i];
                    payloads.unsetKey([eventName, payloadItemName].toPath());
                }

                return this;
            },

            /**
             * @param {string} eventName
             * @returns {object}
             */
            getPayload: function (eventName) {
                return this.payloads.items[eventName];
            }
        });
});
