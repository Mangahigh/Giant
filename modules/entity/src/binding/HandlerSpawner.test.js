(function () {
    "use strict";

    module("HandlerSpawner");

    test("Instantiation", function () {
        var handlerSpawner = $entity.HandlerSpawner.create('foo');

        equal(handlerSpawner.bindingType, 'foo', "should set bindingType property");
    });
}());
