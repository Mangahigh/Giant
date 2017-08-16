$oop.postpone($entity, 'entityEventSpace', function () {
    "use strict";

    /**
     * Event space dedicated to entity events.
     * @type {$event.EventSpace}
     */
    $entity.entityEventSpace = $event.EventSpace.create();
});
