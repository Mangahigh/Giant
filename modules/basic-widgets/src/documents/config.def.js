$oop.amendPostponed($entity, 'config', function () {
    "use strict";

    $entity.config.appendNode('document>field'.toPath(), {
    });
});
