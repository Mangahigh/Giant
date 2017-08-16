$oop.postpone($entity, 'EntityKey', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend()
            .addTrait($event.Evented);

    /**
     * Creates an EntityKey instance.
     * Do not create EntityKey instances directly, only through its subclasses.
     * @name $entity.EntityKey.create
     * @function
     * @returns {$entity.EntityKey}
     */

    /**
     * Base class for entity keys.
     * Entity keys identify entities without relying on their actual content.
     * @class
     * @extends $oop.Base
     * @extends $event.Evented
     * @extends $utils.Stringifiable
     */
    $entity.EntityKey = self
        .setEventSpace($entity.entityEventSpace)
        .setEventPath('entity'.toPath())
        .addMethods(/** @lends $entity.EntityKey# */{
            /** @ignore */
            init: function () {
                $event.Evented.init.call(this);
            },

            /**
             * Fetches an attribute key based on the current key as parent and the specified attribute name.
             * @param {string} attributeName
             * @returns {$entity.AttributeKey}
             */
            getAttributeKey: function (attributeName) {
                return $entity.AttributeKey.create(this, attributeName);
            }
        });

    /**
     * Tells whether specified entity key is identical to the current one.
     * @name $entity.EntityKey#equals
     * @function
     * @param {$entity.EntityKey} key
     * @returns {boolean}
     */

    /**
     * Fetches a key to the document that contains the config information about the current entity.
     * @name $entity.EntityKey#getConfigKey
     * @function
     * @returns {$entity.DocumentKey}
     */

    /**
     * Resolves key to a path that points to the entity node in the cache.
     * @name $entity.EntityKey#getEntityPath
     * @function
     * @returns {$data.Path}
     */
});

(function () {
    "use strict";

    $assertion.addTypes(/** @lends $entity */{
        /** @param {$entity.EntityKey} expr */
        isEntityKey: function (expr) {
            return $entity.EntityKey.isBaseOf(expr);
        },

        /** @param {$entity.EntityKey} [expr] */
        isEntityKeyOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   $entity.EntityKey.isBaseOf(expr);
        }
    });
}());
