(function () {
    "use strict";

    module("FieldKey");

    test("Instantiation", function () {
        var fieldKey = $entity.FieldKey.create('hello', 'world', 'foo');

        ok(fieldKey.documentKey.isA($entity.DocumentKey), "should set document key");
        equal(fieldKey.documentKey.documentType, 'hello', "should set document type");
        equal(fieldKey.documentKey.documentId, 'world', "should set document ID");
        equal(fieldKey.fieldName, 'foo', "should set field name");
        equal(fieldKey.eventPath.toString(), 'entity>document>hello>world>foo',
            "should set event path");
    });

    test("Conversion from String", function () {
        var fieldKey;

        fieldKey = 'foo/bar/baz'.toFieldKey();
        ok(fieldKey.isA($entity.FieldKey), "should return FieldKey instance");
        equal(fieldKey.documentKey.documentType, 'foo', "should set document type");
        equal(fieldKey.documentKey.documentId, 'bar', "should set document ID");
        equal(fieldKey.fieldName, 'baz', "should set field name");

        fieldKey = 'foo/bar/b\\/az'.toFieldKey();
        equal(fieldKey.fieldName, 'b/az', "should URI decode field name");

        fieldKey = 'foo/bar'.toFieldKey();
        equal(typeof fieldKey, 'undefined', "should return undefined for invalid key string");
    });

    test("Conversion from Array", function () {
        var fieldKey;

        fieldKey = ['foo', 'bar', 'baz'].toFieldKey();
        ok(fieldKey.isA($entity.FieldKey), "should return FieldKey instance");
        equal(fieldKey.documentKey.documentType, 'foo', "should set document type");
        equal(fieldKey.documentKey.documentId, 'bar', "should set document ID");
        equal(fieldKey.fieldName, 'baz', "should set field name");

        fieldKey = ['foo', 'bar'].toFieldKey();
        equal(typeof fieldKey, 'undefined', "should return undefined for invalid field name");

        fieldKey = [undefined, 'bar', 'baz'].toFieldKey();
        equal(typeof fieldKey, 'undefined', "should return undefined for invalid document type");

        fieldKey = ['foo', undefined, 'baz'].toFieldKey();
        equal(typeof fieldKey, 'undefined', "should return undefined for invalid document ID");
    });

    test("Equivalence tester", function () {
        ok('foo/bar/baz'.toFieldKey().equals('foo/bar/baz'.toFieldKey()), "should pass on identical content");
        ok(!'foo/bar/baz'.toFieldKey().equals(undefined), "should fail on undefined");
        ok(!'foo/bar/baz'.toFieldKey().equals('foo/baz/baz'.toFieldKey()), "should fail on different document IDs");
        ok(!'foo/bar/baz'.toFieldKey().equals('foo/bar/hello'.toFieldKey()), "should fail on different field name");
    });

    test("Config key getter", function () {
        var fieldKey = 'foo/bar/baz'.toFieldKey(),
            configKey = fieldKey.getConfigKey();

        ok(configKey.isA($entity.DocumentKey), "should return DocumentKey instance");
        ok(configKey.equals(['field', 'foo/baz'].toDocumentKey()), "should return correct config key");
    });

    test("Item key getter", function () {
        var fieldKey = 'foo/bar/baz'.toFieldKey(),
            itemKey = fieldKey.getItemKey('hello');

        ok(itemKey.isA($entity.ItemKey), "should return an ItemKey instance");
        ok(itemKey.documentKey.isA($entity.DocumentKey), "should set document key");
        equal(itemKey.documentKey.documentType, 'foo', "should set document type");
        equal(itemKey.documentKey.documentId, 'bar', "should set document ID");
        equal(itemKey.fieldName, 'baz', "should set field name");
        equal(itemKey.itemId, 'hello', "should set item ID");
    });

    test("Entity path getter", function () {
        expect(3);

        var fieldKey = 'foo/bar/baz'.toFieldKey(),
            documentEntityPath = 'document>entity'.toPath(),
            entityPath = {};

        $entity.DocumentKey.addMocks({
            getEntityPath: function () {
                equal(this.toString(), 'foo/bar', "should get entity key from document key");
                return documentEntityPath;
            }
        });

        documentEntityPath.addMocks({
            appendKey: function (fieldName) {
                equal(fieldName, fieldKey.fieldName, "should append field name to document entity path");
                return entityPath;
            }
        });

        strictEqual(fieldKey.getEntityPath(), entityPath, "should return correct field path");

        $entity.DocumentKey.removeMocks();
    });

    test("Field type getter", function () {
        expect(2);

        var fieldKey = 'foo/bar/baz'.toFieldKey(),
            fieldType = {};

        $entity.config.addMocks({
            getNode: function (path) {
                equal(path.toString(), 'document>field>foo/baz>fieldType');
                return fieldType;
            }
        });

        strictEqual(fieldKey.getFieldType(), fieldType, "should return node fetched from config");

        $entity.config.removeMocks();
    });

    test("Item type getter", function () {
        expect(2);

        var fieldKey = 'foo/bar/baz'.toFieldKey(),
            itemType = {};

        $entity.config.addMocks({
            getNode: function (path) {
                equal(path.toString(), 'document>field>foo/baz>itemType',
                    "should fetch item type from field config");
                return itemType;
            }
        });

        strictEqual(fieldKey.getItemType(), itemType, "should return item type from config");

        $entity.config.removeMocks();
    });

    test("Item ID type getter", function () {
        expect(2);

        var fieldKey = 'foo/bar/baz'.toFieldKey(),
            itemIdType = {};

        $entity.config.addMocks({
            getNode: function (path) {
                equal(path.toString(), 'document>field>foo/baz>itemIdType',
                    "should fetch item ID type from field config");
                return itemIdType;
            }
        });

        strictEqual(fieldKey.getItemIdType(), itemIdType, "should return item ID type from config");

        $entity.config.removeMocks();
    });

    test("Conversion to String", function () {
        equal($entity.FieldKey.create('foo', 'bar', 'baz').toString(), 'foo/bar/baz');
        equal($entity.FieldKey.create('foo', 'bar', 'b/az').toString(), 'foo/bar/b\\/az');
        equal('foo/bar/baz'.toFieldKey().toString(), 'foo/bar/baz');
    });
}());
