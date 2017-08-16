$oop.postpone($data, 'IterativeTreeWalker', function () {
    "use strict";

    /**
     * Instantiates class
     * @name $data.IterativeTreeWalker.create
     * @function
     * @param {function} handler
     * @returns {$data.IterativeTreeWalker}
     */

    /**
     * Traverses tree iteratively, touching all nodes within.
     * @class $data.IterativeTreeWalker
     * @extends $data.TreeWalker
     */
    $data.IterativeTreeWalker = $data.TreeWalker.extend()
        .addMethods(/** @lends $data.IterativeTreeWalker# */{
            /**
             * Traverses all enumerable nodes in object.
             * Iterative implementation.
             * @param node {object} Object to be traversed.
             * @returns {$data.IterativeTreeWalker}
             */
            walk: function (node) {
                // reference to path
                this.currentPath = $data.Path.create([]);

                var keysStack = [Object.keys(node)], // stack of keys associated with each node on current path
                    indexStack = [0], // stack of key indexes on current path
                    nodeStack = [node], // stack of nodes on current path

                    currentPath = this.currentPath.asArray, // key stack, ie. traversal path, calculated

                    currentDepth, // current traversal depth
                    currentParent, // the node we're currently IN (current parent node)
                    currentKeys, // keys in the current parent node
                    currentIndex, // index of key in current parent node
                    currentKey, // key of node we're AT
                    currentNode; // node we're currently AT

                for (; ;) {
                    // determining where we are
                    currentDepth = keysStack.length - 1;
                    currentIndex = indexStack[currentDepth];

                    // testing if current node finished traversal
                    if (currentIndex >= keysStack[currentDepth].length) {
                        // going back a level
                        keysStack.pop();

                        if (!keysStack.length) {
                            // object is fully traversed, exiting
                            break;
                        }

                        nodeStack.pop();
                        indexStack.pop();
                        currentPath.pop();

                        // raising index on parent node
                        indexStack.push(indexStack.pop() + 1);

                        continue;
                    }

                    // obtaining current state as local variables
                    currentKeys = keysStack[currentDepth];
                    this.currentKey = currentKey = currentKeys[currentIndex];
                    currentParent = nodeStack[currentDepth];
                    this.currentNode = currentNode = currentParent[currentKey];
                    currentPath[currentDepth] = currentKey;

                    // calling handler for this node
                    // traversal may be terminated by handler by returning false
                    if (this.handler.call(this, currentNode) === false) {
                        break;
                    }

                    // next step in traversal
                    if (currentNode instanceof Object) {
                        // burrowing deeper - found a node
                        nodeStack.push(currentNode);
                        indexStack.push(0);
                        keysStack.push(Object.keys(currentNode));
                    } else {
                        // moving to next node in parent
                        indexStack[currentDepth]++;
                    }
                }

                // re-setting traversal state
                this.reset();

                return this;
            }
        });
});
