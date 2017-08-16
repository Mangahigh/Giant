(function () {
    "use strict";

    module("Tree Walker");

    test("Instantiation", function () {
        function handler() {}

        throws(function () {
            $data.TreeWalker.create();
        }, "Invalid walker handler");

        var walker = /** @type {$data.IterativeTreeWalker} */ $data.TreeWalker.create(handler);

        strictEqual(walker.handler, handler, "Handler assigned");
        equal(typeof walker.currentKey, 'undefined', "Key uninitialized");
        equal(typeof walker.currentNode, 'undefined', "Node uninitialized");
        equal(typeof walker.currentPath, 'undefined', "Path uninitialized");
        equal(walker.isTerminated, false, "Traversal is not terminated");
    });

    test("Termination", function () {
        var walker = /** @type {$data.IterativeTreeWalker} */ $data.TreeWalker.create(function handler() {}),
            result;

        result = walker.terminateTraversal();

        strictEqual(result, walker, "Is chainable");
        ok(walker.isTerminated, "Termination flag set");
    });

    test("Reset", function () {
        function handler() {}

        var walker = $data.TreeWalker.create(handler),
            result;

        walker.currentKey = 'foo';
        walker.currentNode = {};
        walker.currentPath = 'bar.foo'.toPath();
        walker.isTerminated = true;

        result = walker.reset();

        strictEqual(result, walker, "Reset is chainable");
        equal(typeof walker.currentKey, 'undefined', "Key reset");
        equal(typeof walker.currentNode, 'undefined', "Node reset");
        equal(typeof walker.currentPath, 'undefined', "Path reset");
        equal(walker.isTerminated, false, "Terminated flag reset");
    });
}());
