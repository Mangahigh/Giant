$oop.postpone($entity, 'HandlerSpawner', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * @name $entity.HandlerSpawner.create
     * @function
     * @param {string} [bindingType]
     * @returns {$entity.HandlerSpawner}
     */

    /**
     * @class
     * @extends $oop.Base
     */
    $entity.HandlerSpawner = self
        .addMethods(/** @lends $entity.HandlerSpawner# */{
            /**
             * @param {string} [bindingType]
             * @ignore
             */
            init: function (bindingType) {
                /** @type {string} */
                this.bindingType = bindingType;
            }
        });

    /**
     * @name $entity.HandlerSpawner#spawnHandler
     * @function
     * @param {$entity.EntityBound} instance
     * @param {string} methodName
     * @returns {Function}
     */
});
