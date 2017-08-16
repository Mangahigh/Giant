$oop.postpone($entity, 'EntityChangeEvent', function () {
    "use strict";

    var base = $event.Event,
        self = base.extend();

    /**
     * Instantiates class.
     * @name $entity.EntityChangeEvent.create
     * @param {string} eventName Event name
     * @param {$event.EventSpace} eventSpace Event space associated with event
     * @function
     * @returns {$entity.EntityChangeEvent}
     */

    /**
     * @class
     * @extends $event.Event
     */
    $entity.EntityChangeEvent = self
        .addMethods(/** @lends $entity.EntityChangeEvent# */{
            /**
             * @param {string} eventName
             * @param {$event.EventSpace} eventSpace
             * @ignore
             */
            init: function (eventName, eventSpace) {
                base.init.call(this, eventName, eventSpace);

                /**
                 * Node value before change.
                 * @type {*}
                 */
                this.beforeNode = undefined;

                /**
                 * Node value after change.
                 * @type {*}
                 */
                this.afterNode = undefined;

                /**
                 * Identifies the node that changed if it is different from the observed key.
                 * @type {$entity.EntityKey}
                 */
                this.affectedKey = undefined;
            },

            /**
             * Clones entity change event.
             * @param {$data.Path} [currentPath]
             * @returns {$event.Event}
             */
            clone: function (currentPath) {
                return base.clone.call(this, currentPath)
                    .setBeforeNode(this.beforeNode)
                    .setAfterNode(this.afterNode);
            },

            /**
             * Sets event load before the change.
             * @param {*} value
             * @returns {$entity.EntityChangeEvent}
             */
            setBeforeNode: function (value) {
                this.beforeNode = value;
                return this;
            },

            /**
             * Sets event load after the change.
             * @param {*} value
             * @returns {$entity.EntityChangeEvent}
             */
            setAfterNode: function (value) {
                this.afterNode = value;
                return this;
            },

            /**
             * Sets key identifying changed node.
             * @param {$entity.EntityKey} affectedKey
             * @returns {$entity.EntityChangeEvent}
             */
            setAffectedKey: function (affectedKey) {
                this.affectedKey = affectedKey;
                return this;
            },

            /**
             * Tells whether change event represents an insert.
             * @returns {boolean}
             */
            isInsert: function () {
                return typeof this.beforeNode === 'undefined' &&
                       typeof this.afterNode !== 'undefined';
            },

            /**
             * Tells whether change event represents a deletion.
             * @returns {boolean}
             */
            isDelete: function () {
                return typeof this.beforeNode !== 'undefined' &&
                       typeof this.afterNode === 'undefined';
            }
        });
});

$oop.amendPostponed($event, 'Event', function () {
    "use strict";

    $event.Event.addSurrogate($entity, 'EntityChangeEvent', function (eventName) {
        var prefix = 'entity.change';
        return eventName.substr(0, prefix.length) === prefix;
    });
});

(function () {
    "use strict";

    $assertion.addTypes(/** @lends $entity */{
        /**
         * @param {$entity.EntityChangeEvent} expr
         */
        isEntityChangeEvent: function (expr) {
            return $entity.EntityChangeEvent.isBaseOf(expr);
        },

        /**
         * @param {$entity.EntityChangeEvent} expr
         */
        isEntityChangeEventOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   $entity.EntityChangeEvent.isBaseOf(expr);
        }
    });
}());
