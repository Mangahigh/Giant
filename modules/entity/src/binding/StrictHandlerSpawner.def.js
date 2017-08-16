$oop.postpone($entity, 'StrictHandlerSpawner', function () {
    "use strict";

    var base = $entity.HandlerSpawner,
        self = base.extend();

    /**
     * @name $entity.StrictHandlerSpawner.create
     * @function
     * @returns {$entity.StrictHandlerSpawner}
     */

    /**
     * @class
     * @extends $entity.HandlerSpawner
     */
    $entity.StrictHandlerSpawner = self
        .addMethods(/** @lends $entity.StrictHandlerSpawner# */{
            /**
             * @param {$entity.EntityBound} instance
             * @param {string} methodName
             * @param {$entity.FieldKey} entityKey
             * @returns {Function}
             */
            spawnHandler: function (instance, methodName, entityKey) {
                return function (event) {
                    if (event.sender.equals(entityKey)) {
                        instance[methodName](event);
                    }
                };
            }
        });
});

$oop.amendPostponed($entity, 'HandlerSpawner', function () {
    "use strict";

    $entity.HandlerSpawner
        .addSurrogate($entity, 'StrictHandlerSpawner', function (bindingType) {
            return bindingType === 'strict';
        });
});