(function () {
    "use strict";

    module("EntityKey");

    test("Instantiation", function () {
        var entityKey = $entity.EntityKey.create();

        ok(entityKey.hasOwnProperty('subscriptionRegistry'), "should initialize Evented trait");
    });

    test("Attribute key getter", function () {
        var documentKey = 'foo/bar'.toDocumentKey(),
            attributeKey;

        attributeKey = documentKey.getAttributeKey('baz');

        ok(attributeKey.isA($entity.AttributeKey), "should return AttributeKey instance");
        equal(attributeKey.attributeName, 'baz', "should set attributeName property");
        strictEqual(attributeKey.parentKey, documentKey, "should set parentKey attribute");
    });
}());
