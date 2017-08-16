(function () {
    "use strict";

    module("EntityChangeEvent");

    test("Instantiation", function () {
        var eventSpace = $event.EventSpace.create(),
            event = /** @type {$entity.EntityChangeEvent} */ $entity.EntityChangeEvent.create(
                'foo',
                eventSpace);

        equal(typeof event.beforeNode, 'undefined', "should add beforeNode property");
        equal(typeof event.afterNode, 'undefined', "should add afterNode property");
        equal(typeof event.affectedKey, 'undefined', "should add affectedKey property");
    });

    test("Conversion from Event", function () {
        var event;

        event = $event.Event.create('foo.bar', $event.EventSpace.create());
        ok(!$entity.EntityChangeEvent.isBaseOf(event),
            "should not return EntityChangeEvent instance for non-matching event names");

        event = $event.Event.create('entity.change.foo', $event.EventSpace.create());
        ok($entity.EntityChangeEvent.isBaseOf(event),
            "should return EntityChangeEvent instance for matching event name");
    });

    test("Spawning event", function () {
        var eventSpace = $entity.entityEventSpace.create(),
            event = eventSpace.spawnEvent('entity.change.foo');

        ok($entity.EntityChangeEvent.isBaseOf(event), "should return EntityChangeEvent instance");
    });

    test("Cloning", function () {
        var eventSpace = $event.EventSpace.create(),
            documentKey = 'foo/bar'.toDocumentKey(),
            originalEvent = eventSpace.spawnEvent('entity.change')
                .setBeforeNode('foo')
                .setAfterNode('bar')
                .setAffectedKey(documentKey),
            cloneEvent = originalEvent.clone('foo>bar>baz'.toPath());

        ok(cloneEvent.isA($entity.EntityChangeEvent), "should return EntityChangeEvent instance");
        equal(originalEvent.beforeNode, 'foo', "should set beforeNode on clone");
        equal(originalEvent.afterNode, 'bar', "should set afterNode on clone");
        strictEqual(originalEvent.affectedKey, documentKey, "should set affectedKey on clone");
    });

    test("Before node setter", function () {
        var eventSpace = $event.EventSpace.create(),
            event = eventSpace.spawnEvent($entity.EVENT_ENTITY_CHANGE);

        strictEqual(event.setBeforeNode('foo'), event, "should be chainable");
        equal(event.beforeNode, 'foo', "should set beforeNode property");
    });

    test("After node setter", function () {
        var eventSpace = $event.EventSpace.create(),
            event = eventSpace.spawnEvent($entity.EVENT_ENTITY_CHANGE);

        strictEqual(event.setAfterNode('foo'), event, "should be chainable");
        equal(event.afterNode, 'foo', "should set afterNode property");
    });

    test("Affected key setter", function () {
        var eventSpace = $event.EventSpace.create(),
            documentKey = 'foo/bar'.toDocumentKey(),
            event = eventSpace.spawnEvent($entity.EVENT_ENTITY_CHANGE);

        strictEqual(event.setAffectedKey(documentKey), event, "should be chainable");
        strictEqual(event.affectedKey, documentKey, "should set affectedKey property");
    });

    test("Insertion tester", function () {
        var eventSpace = $event.EventSpace.create(),
            entityChangeEvent;

        entityChangeEvent = eventSpace.spawnEvent($entity.EVENT_ENTITY_CHANGE);
        ok(!entityChangeEvent.isInsert(),
            "should return false when neither beforeNode nor afterNode is set");

        entityChangeEvent = eventSpace.spawnEvent($entity.EVENT_ENTITY_CHANGE)
            .setBeforeNode('foo');
        ok(!entityChangeEvent.isInsert(),
            "should return false when beforeNode is set");

        entityChangeEvent = eventSpace.spawnEvent($entity.EVENT_ENTITY_CHANGE)
            .setAfterNode('bar');
        ok(entityChangeEvent.isInsert(),
            "should return true when only afterNode is set");

        entityChangeEvent = eventSpace.spawnEvent($entity.EVENT_ENTITY_CHANGE)
            .setBeforeNode('foo')
            .setAfterNode('bar');
        ok(!entityChangeEvent.isInsert(),
            "should return false when both beforeNode and afterNode are set");
    });

    test("Deletion tester", function () {
        var eventSpace = $event.EventSpace.create(),
            entityChangeEvent;

        entityChangeEvent = eventSpace.spawnEvent($entity.EVENT_ENTITY_CHANGE);
        ok(!entityChangeEvent.isDelete(),
            "should return false when neither beforeNode nor afterNode is set");

        entityChangeEvent = eventSpace.spawnEvent($entity.EVENT_ENTITY_CHANGE)
            .setBeforeNode('foo');
        ok(entityChangeEvent.isDelete(),
            "should return true when only beforeNode is set");

        entityChangeEvent = eventSpace.spawnEvent('entity.change')
            .setAfterNode('bar');
        ok(!entityChangeEvent.isDelete(),
            "should return false when only afterNode is set");

        entityChangeEvent = eventSpace.spawnEvent($entity.EVENT_ENTITY_CHANGE)
            .setBeforeNode('foo')
            .setAfterNode('bar');
        ok(!entityChangeEvent.isDelete(),
            "should return false when both beforeNode and afterNode are set");
    });
}());
