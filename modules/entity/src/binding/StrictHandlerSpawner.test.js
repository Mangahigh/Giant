(function () {
    "use strict";

    module("StrictHandlerSpawner");

    test("Conversion from HandlerSpawner", function () {
        var handlerSpawner = $entity.HandlerSpawner.create('strict');

        ok(handlerSpawner.isA($entity.StrictHandlerSpawner),
            "should return StrictHandlerSpawner instance");
    });
}());
