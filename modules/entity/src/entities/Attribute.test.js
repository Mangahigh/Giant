(function () {
    "use strict";

    module("Attribute");

    test("Instantiation", function () {
        throws(function () {
            $entity.Attribute.create();
        }, "should raise exception on missing document key argument");

        throws(function () {
            $entity.Attribute.create('foo');
        }, "should raise exception on invalid document key argument");
    });

    test("Conversion from AttributeKey", function () {
        var attributeKey = $entity.AttributeKey.create('foo/bar'.toDocumentKey(), 'baz'),
            attribute = attributeKey.toAttribute();

        ok(attribute.isA($entity.Attribute), "should return Attribute instance");
        strictEqual(attribute.entityKey, attributeKey, "should set attribute key");
    });

    test("Entity surrogate", function () {
        var attributeKey = $entity.AttributeKey.create('foo/bar'.toDocumentKey(), 'baz'),
            entity = $entity.Entity.create(attributeKey);

        ok(entity.isA($entity.Attribute), "should return Attribute instance");
        strictEqual(entity.entityKey, attributeKey, "should set attribute key");
    });

    test("Conversion from EntityKey", function () {
        var attributeKey = $entity.AttributeKey.create('foo/bar'.toDocumentKey(), 'baz'),
            entity = attributeKey.toEntity();

        ok(entity.isA($entity.Attribute), "should return Attribute instance");
        strictEqual(entity.entityKey, attributeKey, "should set attribute key");
    });

    test("Parent entity getter", function () {
        var parentKey = 'foo/bar'.toDocumentKey(),
            attributeKey = $entity.AttributeKey.create(parentKey, 'baz'),
            attribute = attributeKey.toEntity(),
            parentEntity = attribute.getParentEntity();

        ok(parentEntity.isA($entity.Entity), "should return Entity instance");
        ok(parentEntity.entityKey.equals(parentKey),
            "should return corresponding parent entity");
    });
}());
