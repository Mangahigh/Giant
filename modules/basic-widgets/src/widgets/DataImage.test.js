(function () {
    "use strict";

    module("DataImage");

    test("Instantiation", function () {
        throws(function () {
            $basicWidgets.DataImage.create();
        }, "should raise exception on missing arguments");

        throws(function () {
            $basicWidgets.DataImage.create('foo');
        }, "should raise exception on invalid arguments");
    });

    test("URL change handler", function () {
        expect(1);

        var dataImage = $basicWidgets.DataImage.create('photo/1/url'.toFieldKey());

        dataImage.afterAdd();

        dataImage.addMocks({
            _updateImageUrl: function () {
                ok(true, "should update target URL");
            }
        });

        'photo/1/url'.toFieldKey().spawnEvent($entity.EVENT_ENTITY_CHANGE)
            .setBeforeNode('foo')
            .setAfterNode('bar')
            .triggerSync();

        dataImage.afterRemove();
    });
}());
