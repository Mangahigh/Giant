(function () {
    "use strict";

    module("DelegateHandlerSpawner");

    test("Conversion from HandlerSpawner", function () {
        var handlerSpawner = $entity.HandlerSpawner.create('delegate');

        ok(handlerSpawner.isA($entity.DelegateHandlerSpawner),
            "should return DelegateHandlerSpawner instance");
    });
}());
