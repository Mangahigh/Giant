$oop.postpone($entity, 'index', function () {
    "use strict";

    /**
     * Contains indexes and lookups.
     * @type {$data.Tree}
     */
    $entity.index = $data.Tree.create();
});
