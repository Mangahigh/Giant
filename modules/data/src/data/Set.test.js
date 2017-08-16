(function () {
    "use strict";

    module("Set");

    test("Type conversion", function () {
        var hash = $data.Hash.create();

        ok(hash.toSet().isA($data.Set), "Converted to set");
    });

    test("Array conversion", function () {
        var buffer = [1, 2, 3, 4],
            hash = buffer.toSet();

        ok(hash.isA($data.Set), "Is set");
        strictEqual(hash.items, buffer, "Same buffer");
    });

    test("Intersection", function () {
        var set1 = $data.Set.create({
                foo  : 'bar',
                hello: 'world',
                howdy: 'all'
            }),
            set2 = $data.Set.create({
                foo  : 'baz',
                santa: 'claus'
            }),
            result;

        result = set1.intersectWith(set2);

        ok(result.isA($data.Set), "Return type");
        deepEqual(
            result.items,
            {
                foo: 'bar'
            },
            "Intersection contents"
        );
        notDeepEqual(set1.intersectWith(set2).items, set2.intersectWith(set1).items, "Not commutable");
    });

    test("Union", function () {
        var set1 = $data.Set.create({
                foo  : 'bar',
                hello: 'world',
                howdy: 'all'
            }),
            set2 = $data.Set.create({
                foo  : 'baz',
                santa: 'claus'
            }),
            result;

        result = set1.unionWith(set2);

        ok(result.isA($data.Set), "Result type");
        deepEqual(
            result.items,
            {
                foo  : 'bar',
                hello: 'world',
                howdy: 'all',
                santa: 'claus'
            },
            "Union contents"
        );

        notDeepEqual(set1.unionWith(set2).items, set2.unionWith(set1).items, "Not commutable");
    });

    test("Subtraction", function () {
        var set1 = $data.Set.create({
                foo  : 'bar',
                hello: 'world',
                howdy: 'all'
            }),
            set2 = $data.Set.create({
                foo  : 'baz',
                santa: 'claus'
            });

        ok(set1.subtract(set2).isA($data.Set), "Result type");

        deepEqual(
            set1.subtract(set2).items,
            {
                hello: 'world',
                howdy: 'all'
            },
            "A-B contents"
        );

        deepEqual(
            set2.subtract(set1).items,
            {
                santa: 'claus'
            },
            "B-A contents"
        );
    });

    test("Subtraction 2", function () {
        var set1 = $data.Set.create({
                foo  : 'bar',
                hello: 'world',
                howdy: 'all'
            }),
            set2 = $data.Set.create({
                foo  : 'baz',
                santa: 'claus'
            });

        ok(set1.subtractFrom(set2).isA($data.Set), "Result type");

        deepEqual(
            set2.subtractFrom(set1).items,
            {
                hello: 'world',
                howdy: 'all'
            },
            "A-B contents"
        );

        deepEqual(
            set1.subtractFrom(set2).items,
            {
                santa: 'claus'
            },
            "B-A contents"
        );
    });

    test("Difference", function () {
        var set1 = $data.Set.create({
                foo  : 'bar',
                hello: 'world',
                howdy: 'all'
            }),
            set2 = $data.Set.create({
                foo  : 'baz',
                santa: 'claus'
            });

        deepEqual(
            set1.differenceWith(set2).items,
            {
                hello: 'world',
                howdy: 'all',
                santa: 'claus'
            },
            "Difference bw. A and B"
        );

        deepEqual(set1.differenceWith(set2).items, set2.differenceWith(set1).items, "Commutable");
    });
}());
