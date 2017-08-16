$oop.postpone($entity, 'ContentHandlerSpawner', function () {
    "use strict";

    var base = $entity.HandlerSpawner,
        self = base.extend();

    /**
     * @name $entity.ContentHandlerSpawner.create
     * @function
     * @returns {$entity.ContentHandlerSpawner}
     */

    /**
     * @class
     * @extends $entity.HandlerSpawner
     */
    $entity.ContentHandlerSpawner = self
        .addMethods(/** @lends $entity.ContentHandlerSpawner# */{
            /**
             * @param {$entity.EntityBound} instance
             * @param {string} methodName
             * @returns {Function}
             */
            spawnHandler: function (instance, methodName) {
                return instance[methodName].bind(instance);
            }
        });
});

$oop.amendPostponed($entity, 'HandlerSpawner', function () {
    "use strict";

    $entity.HandlerSpawner
        .addSurrogate($entity, 'ContentHandlerSpawner', function (bindingType) {
            return bindingType === 'content';
        });
});
