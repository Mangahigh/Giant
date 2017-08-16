(function () {
    "use strict";

    module("ContentHandlerSpawner");

    test("Conversion from HandlerSpawner", function () {
        var handlerSpawner = $entity.HandlerSpawner.create('content');

        ok(handlerSpawner.isA($entity.ContentHandlerSpawner),
            "should return ContentHandlerSpawner instance");
    });
}());
