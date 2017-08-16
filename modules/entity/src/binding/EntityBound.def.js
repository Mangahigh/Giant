$oop.postpone($entity, 'EntityBound', function () {
    "use strict";

    /**
     * The EntityBound trait binds instances of the host class to entity events.
     * @class
     * @extends $oop.Base
     */
    $entity.EntityBound = $oop.Base.extend()
        .addPrivateMethods(/** @lends $entity.EntityBound# */{
            /**
             * @param {$entity.EntityKey} targetKey
             * @param {$entity.EntityKey} captureKey
             * @param {string} eventName
             * @param {string} methodName
             * @param {string} bindingType
             * @private
             */
            _bindToEntity: function (targetKey, captureKey, eventName, methodName, bindingType) {
                var entityBindings = this.entityBindings,
                    bindingPath = [targetKey.toString(), eventName, methodName, bindingType].toPath(),
                    bindingInfo = entityBindings.getNode(bindingPath),
                    handler;

                if (!bindingInfo) {
                    handler = $entity.HandlerSpawner.create(bindingType)
                        .spawnHandler(this, methodName, targetKey);
                    captureKey.subscribeTo(eventName, handler);
                    entityBindings.setNode(bindingPath, {
                        targetKey  : targetKey,
                        captureKey : captureKey,
                        eventName  : eventName,
                        methodName : methodName,
                        bindingType: bindingType,
                        handler    : handler
                    });
                }
            },

            /**
             * @param {$entity.EntityKey} targetKey
             * @param {$entity.EntityKey} captureKey
             * @param {string} eventName
             * @param {string} methodName
             * @param {string} bindingType
             * @private
             */
            _unbindFromEntity: function (targetKey, captureKey, eventName, methodName, bindingType) {
                var entityBindings = this.entityBindings,
                    bindingPath = [targetKey.toString(), eventName, methodName, bindingType].toPath(),
                    bindingInfo = entityBindings.getNode(bindingPath),
                    handler;

                if (bindingInfo) {
                    handler = bindingInfo.handler;
                    captureKey.unsubscribeFrom(eventName, handler);
                    entityBindings.unsetPath(bindingPath);
                }
            }
        })
        .addMethods(/** @lends $entity.EntityBound# */{
            /** Call from host class .init(). */
            init: function () {
                /** @type {$data.Tree} */
                this.entityBindings = $data.Tree.create();
            },

            /**
             * Subscribes method to be triggered on the specified custom event passing through the entity.
             * @param {$entity.EntityKey} entityKey
             * @param {string} eventName
             * @param {string} methodName
             * @returns {$entity.EntityBound}
             */
            bindToEntityContent: function (entityKey, eventName, methodName) {
                $assertion
                    .isEntityKey(entityKey, "Invalid entity key")
                    .isString(eventName, "Invalid event name")
                    .isFunction(this[methodName], "Attempting to bind non-method");

                this._bindToEntity(entityKey, entityKey, eventName, methodName, 'content');

                return this;
            },

            /**
             * Unsubscribes method from the specified custom event passing through the entity.
             * @param {$entity.EntityKey} entityKey
             * @param {string} eventName
             * @param {string} methodName
             * @returns {$entity.EntityBound}
             */
            unbindFromEntityContent: function (entityKey, eventName, methodName) {
                $assertion
                    .isEntityKey(entityKey, "Invalid entity key")
                    .isString(eventName, "Invalid event name")
                    .isFunction(this[methodName], "Attempting to unbind non-method");

                this._unbindFromEntity(entityKey, entityKey, eventName, methodName, 'content');

                return this;
            },

            /**
             * Subscribes method to be triggered on the specified custom event is triggered on the specified entity.
             * @param {$entity.EntityKey} entityKey
             * @param {string} eventName
             * @param {string} methodName
             * @returns {$entity.EntityBound}
             */
            bindToEntity: function (entityKey, eventName, methodName) {
                $assertion
                    .isEntityKey(entityKey, "Invalid entity key")
                    .isString(eventName, "Invalid event name")
                    .isFunction(this[methodName], "Attempting to bind non-method");

                this._bindToEntity(entityKey, entityKey, eventName, methodName, 'strict');

                return this;
            },

            /**
             * Unsubscribes method from the specified custom event triggered on the specified entity.
             * @param {$entity.EntityKey} entityKey
             * @param {string} eventName
             * @param {string} methodName
             * @returns {$entity.EntityBound}
             */
            unbindFromEntity: function (entityKey, eventName, methodName) {
                $assertion
                    .isEntityKey(entityKey, "Invalid entity key")
                    .isString(eventName, "Invalid event name")
                    .isFunction(this[methodName], "Attempting to unbind non-method");

                this._unbindFromEntity(entityKey, entityKey, eventName, methodName, 'strict');

                return this;
            },

            /**
             * Subscribes method to be triggered on any access event passing through the entity.
             * @param {$entity.EntityKey} entityKey
             * @param {string} methodName
             * @returns {$entity.EntityBound}
             */
            bindToEntityContentAccess: function (entityKey, methodName) {
                $assertion
                    .isEntityKey(entityKey, "Invalid entity key")
                    .isFunction(this[methodName], "Attempting to bind non-method");

                this._bindToEntity(
                    entityKey,
                    entityKey,
                    $entity.EVENT_ENTITY_ACCESS,
                    methodName,
                    'content');

                return this;
            },

            /**
             * Unsubscribes method from access events passing through the entity.
             * @param {$entity.EntityKey} entityKey
             * @param {string} methodName
             * @returns {$entity.EntityBound}
             */
            unbindFromEntityContentAccess: function (entityKey, methodName) {
                $assertion
                    .isEntityKey(entityKey, "Invalid entity key")
                    .isFunction(this[methodName], "Attempting to unbind non-method");

                this._unbindFromEntity(
                    entityKey,
                    entityKey,
                    $entity.EVENT_ENTITY_ACCESS,
                    methodName,
                    'content');

                return this;
            },

            /**
             * Subscribes method to be triggered when the specified entity is accessed.
             * @param {$entity.EntityKey} entityKey
             * @param {string} methodName
             * @returns {$entity.EntityBound}
             */
            bindToEntityAccess: function (entityKey, methodName) {
                $assertion
                    .isEntityKey(entityKey, "Invalid entity key")
                    .isFunction(this[methodName], "Attempting to bind non-method");

                this._bindToEntity(
                    entityKey,
                    entityKey,
                    $entity.EVENT_ENTITY_ACCESS,
                    methodName,
                    'strict');

                return this;
            },

            /**
             * Unsubscribes method from access events triggered on the specified entity.
             * @param {$entity.EntityKey} entityKey
             * @param {string} methodName
             * @returns {$entity.EntityBound}
             */
            unbindFromEntityAccess: function (entityKey, methodName) {
                $assertion
                    .isEntityKey(entityKey, "Invalid entity key")
                    .isFunction(this[methodName], "Attempting to unbind non-method");

                this._unbindFromEntity(
                    entityKey,
                    entityKey,
                    $entity.EVENT_ENTITY_ACCESS,
                    methodName,
                    'strict');

                return this;
            },

            /**
             * Subscribes method to be triggered on any change event passing through the entity.
             * @param {$entity.EntityKey} entityKey
             * @param {string} methodName
             * @returns {$entity.EntityBound}
             */
            bindToEntityContentChange: function (entityKey, methodName) {
                $assertion
                    .isEntityKey(entityKey, "Invalid entity key")
                    .isFunction(this[methodName], "Attempting to bind non-method");

                this._bindToEntity(
                    entityKey,
                    entityKey,
                    $entity.EVENT_ENTITY_CHANGE,
                    methodName,
                    'content');

                return this;
            },

            /**
             * Unsubscribes method from change events passing through the entity.
             * @param {$entity.EntityKey} entityKey
             * @param {string} methodName
             * @returns {$entity.EntityBound}
             */
            unbindFromEntityContentChange: function (entityKey, methodName) {
                $assertion
                    .isEntityKey(entityKey, "Invalid entity key")
                    .isFunction(this[methodName], "Attempting to unbind non-method");

                this._unbindFromEntity(
                    entityKey,
                    entityKey,
                    $entity.EVENT_ENTITY_CHANGE,
                    methodName,
                    'content');

                return this;
            },

            /**
             * Subscribes method to be triggered only when specified entity is replaced.
             * @param {$entity.EntityKey} entityKey
             * @param {string} methodName
             * @returns {$entity.EntityBound}
             */
            bindToEntityChange: function (entityKey, methodName) {
                $assertion
                    .isEntityKey(entityKey, "Invalid entity key")
                    .isFunction(this[methodName], "Attempting to bind non-method");

                this._bindToEntity(
                    entityKey,
                    entityKey,
                    $entity.EVENT_ENTITY_CHANGE,
                    methodName,
                    'strict');

                return this;
            },

            /**
             * Unsubscribes method from change events triggered on the specified entity.
             * @param {$entity.EntityKey} entityKey
             * @param {string} methodName
             * @returns {$entity.EntityBound}
             */
            unbindFromEntityChange: function (entityKey, methodName) {
                $assertion
                    .isEntityKey(entityKey, "Invalid entity key")
                    .isFunction(this[methodName], "Attempting to unbind non-method");

                this._unbindFromEntity(
                    entityKey,
                    entityKey,
                    $entity.EVENT_ENTITY_CHANGE,
                    methodName,
                    'strict');

                return this;
            },

            /**
             * Subscribes method to be triggered when the specified entity or any of its parents change.
             * Adds `affectedKey` payload / property to event.
             * @param {$entity.EntityKey} entityKey
             * @param {string} methodName
             * @returns {$entity.EntityBound}
             */
            bindToDelegatedEntityChange: function (entityKey, methodName) {
                $assertion
                    .isEntityKey(entityKey, "Invalid entity key")
                    .isFunction(this[methodName], "Attempting to bind non-method");

                this._bindToEntity(
                    entityKey,
                    entityKey.documentKey,
                    $entity.EVENT_ENTITY_CHANGE,
                    methodName,
                    'delegate');

                return this;
            },

            /**
             * Unsubscribes method from delegated changes.
             * @param {$entity.EntityKey} entityKey
             * @param {string} methodName
             * @returns {$entity.EntityBound}
             */
            unbindFromDelegatedEntityChange: function (entityKey, methodName) {
                $assertion
                    .isEntityKey(entityKey, "Invalid entity key")
                    .isFunction(this[methodName], "Attempting to unbind non-method");

                this._unbindFromEntity(
                    entityKey,
                    entityKey.documentKey,
                    $entity.EVENT_ENTITY_CHANGE,
                    methodName,
                    'delegate');

                return this;
            },

            /**
             * Removes and unsubscribes all bindings associated with the current instance.
             * @returns {$entity.EntityBound}
             */
            unbindAll: function () {
                var that = this;

                // querying all binding parameters
                this.entityBindings
                    .queryValuesAsHash('|>|>|>|'.toQuery())
                    .toCollection()
                    .forEachItem(function (bindingInfo) {
                        that._unbindFromEntity(
                            bindingInfo.targetKey,
                            bindingInfo.captureKey,
                            bindingInfo.eventName,
                            bindingInfo.methodName,
                            bindingInfo.bindingType);
                    });

                return this;
            }
        });
});
