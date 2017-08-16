$oop.postpone($entity, 'Entity', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend(),
        shallowCopy = $data.DataUtils.shallowCopy;

    /**
     * Creates an Entity instance.
     * Entity instantiation is expected to be done via subclasses, unless there are suitable surrogates defined.
     * @name $entity.Entity.create
     * @function
     * @param {$entity.EntityKey} entityKey Identifies entity.
     * @returns {$entity.Entity}
     */

    /**
     * The Entity class serves as the base class for all entities. It provides an API to access and modify the cache
     * node represented by the entity.
     * @class
     * @extends $oop.Base
     */
    $entity.Entity = self
        .addMethods(/** @lends $entity.Entity# */{
            /**
             * @param {$entity.EntityKey} entityKey
             * @ignore
             */
            init: function (entityKey) {
                /**
                 * Key that identifies the entity.
                 * @type {$entity.EntityKey}
                 */
                this.entityKey = entityKey;
            },

            /**
             * Fetches an Entity that is the current entity's parent.
             * Returns undefined by default. Subclasses need to override.
             * @returns {$entity.Entity}
             */
            getParentEntity: function () {
                return undefined;
            },

            /**
             * Fetches an Attribute entity for the specified attribute name.
             * @param {string} attributeName
             * @returns {$entity.Entity}
             */
            getAttribute: function (attributeName) {
                return this.entityKey.getAttributeKey(attributeName).toEntity();
            },

            /**
             * Fetches entity node from cache.
             * @returns {*}
             */
            getNode: function () {
                var entityPath = this.entityKey.getEntityPath(),
                    entityNode = $entity.entities.getNode(entityPath);

                if (typeof entityNode === 'undefined') {
                    // triggering event about absent node
                    this.entityKey.triggerSync($entity.EVENT_ENTITY_ACCESS);
                }

                return entityNode;
            },

            /**
             * Fetches entity node from cache, wrapped in a Hash instance.
             * @returns {$data.Hash}
             */
            getNodeAsHash: function () {
                return $data.Hash.create(this.getNode());
            },

            /**
             * Fetches entity node from cache without triggering access events.
             * @returns {*}
             */
            getSilentNode: function () {
                var entityPath = this.entityKey.getEntityPath();
                return $entity.entities.getNode(entityPath);
            },

            /**
             * Fetches entity node from cache, wrapped in a Hash instance, without triggering access events.
             * @returns {$data.Hash}
             */
            getSilentNodeAsHash: function () {
                return $data.Hash.create(this.getSilentNode());
            },

            /**
             * Touches entity node, triggering access event when absent, but not returning the node itself.
             * @returns {$entity.Entity}
             */
            touchNode: function () {
                this.getNode();
                return this;
            },

            /**
             * Replaces entity node with the specified value.
             * @param {*} node
             * @returns {$entity.Entity}
             */
            setNode: function (node) {
                var entityKey = this.entityKey,
                    beforeNode = this.getSilentNode();

                if (node !== beforeNode) {
                    $entity.entities.setNode(entityKey.getEntityPath(), node);

                    entityKey.spawnEvent($entity.EVENT_ENTITY_CHANGE)
                        .setBeforeNode(beforeNode)
                        .setAfterNode(node)
                        .triggerSync();
                }

                return this;
            },

            /**
             * Appends the specified node to the current node. Performs a shallow-merge.
             * In case of conflicts, the specified node's properties win out.
             * Triggering the event shallow copies the entire starting contents of the collection.
             * Do not use on large collections.
             * @param {object} node
             * @returns {$entity.Entity}
             */
            appendNode: function (node) {
                var that = this,
                    entityKey = this.entityKey,
                    entityPath = entityKey.getEntityPath(),
                    entityNode = this.getSilentNode(),
                    beforeNode = shallowCopy(entityNode);

                $entity.entities.appendNode(entityPath, node, function () {
                    entityKey.spawnEvent($entity.EVENT_ENTITY_CHANGE)
                        .setBeforeNode(beforeNode)
                        .setAfterNode(that.getSilentNode())
                        .triggerSync();
                });

                return this;
            },

            /**
             * Removes entity node from cache.
             * @returns {$entity.Entity}
             */
            unsetNode: function () {
                var entityKey = this.entityKey,
                    entityPath = entityKey.getEntityPath(),
                    beforeNode = this.getSilentNode();

                if (typeof beforeNode !== 'undefined') {
                    $entity.entities.unsetNode(entityPath);

                    entityKey.spawnEvent($entity.EVENT_ENTITY_CHANGE)
                        .setBeforeNode(beforeNode)
                        .triggerSync();
                }

                return this;
            },

            /**
             * Removes entity from cache, altering the parent node.
             * Performs shallow copy of the node, not recommended to use with large nodes,
             * eg. large collections.
             * @param {boolean} [splice] Whether to splice the parent node if it's an Array.
             * @returns {$entity.Entity}
             */
            unsetKey: function (splice) {
                var parentEntity = this.getParentEntity(),
                    parentNodeBefore = shallowCopy(parentEntity.getSilentNode()),
                    entityPath = this.entityKey.getEntityPath();

                $entity.entities.unsetKey(entityPath, splice, function (parentPath, parentNodeAfter) {
                    parentEntity.entityKey
                        .spawnEvent($entity.EVENT_ENTITY_CHANGE)
                        .setBeforeNode(parentNodeBefore)
                        .setAfterNode(parentNodeAfter)
                        .triggerSync();
                });

                return this;
            }
        });
});

(function () {
    "use strict";

    $oop.addGlobalConstants.call($entity, /** @lends $entity */{
        /**
         * Signals that an absent entity has been accessed.
         * TODO: Revisit after invalidation is implemented.
         * @constant
         */
        EVENT_ENTITY_ACCESS: 'entity.access',

        /**
         * Signals that an entity node was changed.
         * @constant
         */
        EVENT_ENTITY_CHANGE: 'entity.change'
    });
}());

$oop.amendPostponed($entity, 'EntityKey', function () {
    "use strict";

    $entity.EntityKey
        .addMethods(/** @lends $entity.EntityKey */{
            /** @returns {$entity.Entity} */
            toEntity: function () {
                return $entity.Entity.create(this);
            }
        });
});
