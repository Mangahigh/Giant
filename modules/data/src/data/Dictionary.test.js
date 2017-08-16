(function () {
    "use strict";

    module("Dictionary");

    test("Type conversion", function () {
        var hash = $data.Hash.create(),
            dict = hash.toDictionary();

        ok(dict.isA($data.Dictionary), "Hash converted to dictionary");
    });

    test("Value count", function () {
        var dictionary = $data.Dictionary.create({
            foo  : ['bar', 'moo'],
            hello: 'world'
        });

        equal(dictionary._countValues(), 3, "Two in array, one aside");
    });

    test("Instantiation", function () {
        var dict;

        dict = $data.Dictionary.create();

        equal(dict.keyCount, 0, "Item count in empty buffer");
        equal(dict.itemCount, 0, "Value count in empty buffer");

        dict = $data.Dictionary.create({
            foo  : ['bar', 'moo'],
            hello: 'world'
        });

        equal(typeof dict.keyCount, 'undefined', "Item count uninitialized in populated buffer");
        equal(typeof dict.itemCount, 'undefined', "Value count uninitialized in populated buffer");
    });

    test("Array conversion", function () {
        var buffer = [1, 2, 3, 4],
            hash = buffer.toDictionary();

        ok(hash.isA($data.Dictionary), "Is dictionary");
        strictEqual(hash.items, buffer, "Same buffer");
    });

    test("Single item addition", function () {
        /**
         * @type {$data.Dictionary}
         */
        var dict = $data.Dictionary.create();

        dict.addItem('foo', 'bar');
        equal(dict.keyCount, 1, "Item count");
        equal(dict.itemCount, 1, "Value count");
        deepEqual(dict.items, {
            foo: 'bar'
        }, "Key-value pair added to dictionary");

        dict.addItem('hello', 'world');
        equal(dict.keyCount, 2, "Item count");
        equal(dict.itemCount, 2, "Value count");
        deepEqual(dict.items, {
            foo  : 'bar',
            hello: 'world'
        }, "Key-value pair added to dictionary");

        dict.addItem('foo', 'moo');
        equal(dict.keyCount, 2, "Item count");
        equal(dict.itemCount, 3, "Value count");
        deepEqual(dict.items, {
            foo  : ['bar', 'moo'],
            hello: 'world'
        }, "Value added by existing key");

        dict.addItem('foo', 'boo');
        equal(dict.keyCount, 2, "Item count");
        equal(dict.itemCount, 4, "Value count");
        deepEqual(dict.items, {
            foo  : ['bar', 'moo', 'boo'],
            hello: 'world'
        }, "Value added by existing key");
    });

    test("Array item addition", function () {
        /**
         * @type {$data.Dictionary}
         */
        var dict = $data.Dictionary.create();

        dict.addItem('foo', ['bar']);
        deepEqual(dict.items, {
            foo: 'bar'
        }, "Key-value pair added to dictionary");

        dict.addItem('hello', ['world']);
        deepEqual(dict.items, {
            foo  : 'bar',
            hello: 'world'
        }, "Key-value pair added to dictionary");

        dict.addItem('foo', ['moo']);
        deepEqual(dict.items, {
            foo  : ['bar', 'moo'],
            hello: 'world'
        }, "Value added by existing key");

        dict.addItem('foo', ['boo']);
        deepEqual(dict.items, {
            foo  : ['bar', 'moo', 'boo'],
            hello: 'world'
        }, "Value added by existing key");
    });

    test("Item addition to multiple keys", function () {
        /**
         * @type {$data.Dictionary}
         */
        var dict = $data.Dictionary.create();

        throws(function () {
            dict.addItems('foo', 'bar');
        }, "Invalid keys");

        dict.addItems(['foo', 'boo'], 'bar');
        deepEqual(dict.items, {
            foo: 'bar',
            boo: 'bar'
        }, "Key-value pairs added to dictionary");

        dict.addItems(['foo', 'moo'], 'hello');
        deepEqual(dict.items, {
            foo: ['bar', 'hello'],
            boo: 'bar',
            moo: 'hello'
        }, "More key-value pairs added to dictionary");
    });

    test("Item removal", function () {
        var dict = $data.Dictionary.create({
            foo  : ['bar', 'BAR', 'woot'],
            hello: 'world'
        });

        dict.removeItem('foo', 'BAR');

        // must use .getXXXCount() for first time to count keys / items
        equal(dict.getKeyCount(), 2, "Item count");
        equal(dict.getItemCount(), 3, "Value count");
        deepEqual(
            dict.items,
            {
                foo  : ['bar', 'woot'],
                hello: 'world'
            },
            "Removed value from item holding many values"
        );

        dict.removeItem('foo', 'bar');

        equal(dict.keyCount, 2, "Item count");
        equal(dict.itemCount, 2, "Value count");
        deepEqual(
            dict.items,
            {
                foo  : 'woot',
                hello: 'world'
            },
            "Single value remains in item"
        );

        dict.removeItem('foo', 'woot');

        equal(dict.keyCount, 1, "Item count");
        equal(dict.itemCount, 1, "Value count");
        deepEqual(
            dict.items,
            {
                hello: 'world'
            },
            "Lat value removed from item"
        );

        dict.removeItem('hello');

        equal(dict.keyCount, 0, "Item count");
        equal(dict.itemCount, 0, "Value count");
        deepEqual(
            dict.items,
            {},
            "Full item removed"
        );
    });

    test("Multiple items removal", function () {
        var dict = $data.Dictionary.create({
            foo: ['bar', 'hello'],
            boo: 'bar',
            moo: 'hello'
        });

        throws(function () {
            dict.removeItems('foo');
        }, "Invalid keys");

        dict.removeItems(['foo', 'moo']);

        deepEqual(
            dict.items,
            {
                boo: 'bar'
            },
            "Two items removed"
        );
    });

    test("Multiple values removal", function () {
        var dict = $data.Dictionary.create({
            foo: ['bar', 'hello'],
            boo: 'bar',
            moo: 'hello'
        });

        dict.removeItems(['foo', 'moo'], 'hello');

        deepEqual(
            dict.items,
            {
                foo: 'bar',
                boo: 'bar'
            },
            "One value removed from two items"
        );
    });

    test("Item retrieval", function () {
        /**
         * @type {$data.Dictionary}
         */
        var dict = $data.Dictionary.create({
            foo  : ['bar', 'moo', 'boo'],
            hello: 'world',
            1    : 'howdy'
        });

        throws(function () {
            dict.getItem(true);
        }, "Invalid key");

        equal(dict.getItem(1), 'howdy', "Retrieving by numeric key");

        equal(dict.getItem('hello'), 'world', "Retrieving by string key");
        deepEqual(
            dict.getItem('foo'),
            ['bar', 'moo', 'boo'],
            "Retrieving array value"
        );
        deepEqual(
            dict.getItem(['hello', 'foo']),
            ['world', 'bar', 'moo', 'boo'],
            "Retrieving multiple values"
        );

        deepEqual(
            dict.getItem(['hello', 'INVALID']),
            ['world'],
            "Retrieving invalid values"
        );

        deepEqual(
            dict.getItem('INVALID1'),
            undefined,
            "Retrieving non-existing item"
        );

        deepEqual(
            dict.getItem(['INVALID1', 'INVALID2']),
            undefined,
            "Retrieving non existing items"
        );
    });

    test("Item counter", function () {
        var dictionary = $data.Dictionary.create({
            foo  : 'bar',
            hello: ['world', 'all']
        });

        equal(typeof dictionary.itemCount, 'undefined', "Key count uninitialized");
        equal(dictionary.getItemCount(), 3, "Counter ran");
        equal(dictionary.itemCount, 3, "Item count set after first call");
    });

    test("Cloning", function () {
        var dictionary = $data.Dictionary.create()
            .addItem('foo', ["hello", "world"])
            .addItem('bar', "baz"),
            clone = dictionary.clone();

        notStrictEqual(clone.items, dictionary.items, "Buffers not the same");
        deepEqual(clone.items, dictionary.items, "Buffer contents are the same");
        equal(clone.keyCount, dictionary.keyCount, "Key counts match");
        equal(clone.itemCount, dictionary.itemCount, "Item counts match");
    });

    test("Clearing", function () {
        var dict = $data.Dictionary.create({
            foo  : 'bar',
            hello: ['world', 'all']
        });

        dict.clear();
        equal(dict.keyCount, 0, "Key count after emptying");
        equal(dict.itemCount, 0, "Item (KV pair) count after emptying");
    });

    test("For Each", function () {
        var dictionary = $data.Dictionary.create({
                foo : ['bar', 'baz'],
                quux: 1
            }),
            result = [];

        function handler(value, key) {
            result.push([key, value]);
        }

        strictEqual(dictionary.forEachItem(handler), dictionary,
            "should be chainable");

        deepEqual(result, [
            ['foo', 'bar'],
            ['foo', 'baz'],
            ['quux', 1]
        ], "should iterate over all key-value pairs in dictionary");
    });
}());
