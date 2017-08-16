(function () {
    "use strict";

    module("CollectionField");

    test("Field surrogate", function () {
        expect(4);

        var collection,
            testedField;

        $entity.FieldKey.addMocks({
            getFieldType: function () {
                testedField = this.toString();
                return 'collection';
            }
        });

        collection = $entity.Field.create('foo/bar/baz'.toFieldKey());

        $entity.FieldKey.removeMocks();

        ok(collection.isA($entity.CollectionField), "should return CollectionField instance when field type is 'collection'");
        equal(testedField, 'foo/bar/baz', "should test field type");

        $entity.FieldKey.addMocks({
            getFieldType: function () {
                return 'string';
            }
        });

        collection = $entity.Field.create('foo/bar/baz'.toFieldKey());
        ok(collection.isA($entity.Field),
            "should return Field instance when field type is not 'collection'");
        ok(!collection.isA($entity.CollectionField),
            "should return plain Field instance when field type is not 'collection'");

        $entity.FieldKey.removeMocks();
    });

    test("Items getter", function () {
        expect(2);

        var collection = $entity.CollectionField.create('foo/bar/baz'.toFieldKey()),
            itemsNode = {},
            result;

        $entity.Field.addMocks({
            getValue: function () {
                equal(this.entityKey.toString(), 'foo/bar/baz', "should get field value");
                return itemsNode;
            }
        });

        result = collection.getItems();

        strictEqual(result, itemsNode, "should return Collection instance with the field value in it");

        $entity.Field.removeMocks();
    });

    test("Collection getter", function () {
        expect(3);

        var collection = $entity.CollectionField.create('foo/bar/baz'.toFieldKey()),
            itemsNode = {},
            result;

        $entity.Field.addMocks({
            getValue: function () {
                equal(this.entityKey.toString(), 'foo/bar/baz', "should get field value");
                return itemsNode;
            }
        });

        result = collection.getItemsAsCollection();

        ok(result.isA($data.Collection), "should return Collection instance");
        strictEqual(result.items, itemsNode, "should return Collection instance with the field value in it");

        $entity.Field.removeMocks();
    });

    test("Item getter", function () {
        var collection = $entity.CollectionField.create('foo/bar/baz'.toFieldKey()),
            result;

        result = collection.getItem('A');

        ok(result.isA($entity.Item), "should return Item instance");
        equal(result.entityKey.toString(), 'foo/bar/baz/A', "should set the correct item key on the returned Item");
    });

    test("Item key by value getter", function () {
        var collection = $entity.CollectionField.create('foo/bar/baz'.toFieldKey()),
            itemsNode = {
                a: 'A',
                b: 'B',
                c: 'C'
            },
            result;

        collection.addMocks({
            getItems: function () {
                return itemsNode;
            }
        });

        $entity.Item.addMocks({
            getValue: function () {
                return itemsNode[this.entityKey.itemId];
            }
        });

        equal(typeof collection.getItemKeyByValue('D'), 'undefined', "should return undefined for absent value");

        result = collection.getItemKeyByValue('B');

        $entity.Item.removeMocks();

        ok(result.isA($entity.ItemKey), "should return ItemKey instance");
        equal(result.toString(), 'foo/bar/baz/b', "should return correct key");
    });

    test("Item by value getter", function () {
        var collection = $entity.CollectionField.create('foo/bar/baz'.toFieldKey()),
            itemsNode = {
                a: 'A',
                b: 'B',
                c: 'C'
            },
            result;

        collection.addMocks({
            getItems: function () {
                return itemsNode;
            }
        });

        $entity.Item.addMocks({
            getValue: function () {
                return itemsNode[this.entityKey.itemId];
            }
        });

        equal(typeof collection.getItemKeyByValue('D'), 'undefined', "should return undefined for absent value");

        result = collection.getItemByValue('B');

        $entity.Item.removeMocks();

        ok(result.isA($entity.Item), "should return Item instance");
        equal(result.entityKey.toString(), 'foo/bar/baz/b', "should return correct entity");
    });

    test("Appending items", function () {
        'foo/bar'.toDocument().setNode({
            collection: {
                a: 'A',
                b: 'B'
            }
        });

        var collectionField = $entity.CollectionField.create('foo/bar/collection'.toFieldKey());

        strictEqual(collectionField.appendItems({
            c: 'C',
            d: 'D'
        }), collectionField, "should be chainable");

        deepEqual(collectionField.getNode(), {
            a: 'A',
            b: 'B',
            c: 'C',
            d: 'D'
        });
    });
}());
