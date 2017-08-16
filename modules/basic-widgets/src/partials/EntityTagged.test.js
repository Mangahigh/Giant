(function () {
    "use strict";

    module("EntityTagged");

    var DataText = $basicWidgets.Text.extend('DataText')
        .addTrait($basicWidgets.EntityTagged)
        .addMethods({
            init: function (entityKey) {
                $basicWidgets.Text.init.call(this);
                $basicWidgets.EntityTagged.init.call(this, entityKey);
            }
        });

    test("Instantiation", function () {
        var dataText = DataText.create('foo/bar'.toDocumentKey());
        ok(dataText.entityKey.equals('foo/bar'.toDocumentKey()), "should set entityKey property");
    });

    test("Revealing key", function () {
        expect(3);

        var dataText = DataText.create('foo/bar'.toDocumentKey());

        dataText.addMocks({
            addAttribute: function (attributeName, attributeValue) {
                equal(attributeName, $basicWidgets.EntityTagged.ATTRIBUTE_NAME_ENTITY_KEY,
                    "should add entity key attribute");
                equal(attributeValue, 'foo/bar', "should pass entity key to attribute addition");
            }
        });

        strictEqual(dataText.revealKey(), dataText, "should be chainable");
    });

    test("Hiding key", function () {
        expect(2);

        var dataText = DataText.create('foo/bar'.toDocumentKey());

        dataText.addMocks({
            removeAttribute: function (attributeName) {
                equal(attributeName, $basicWidgets.EntityTagged.ATTRIBUTE_NAME_ENTITY_KEY,
                    "should remove entity key attribute");
            }
        });

        strictEqual(dataText.hideKey(), dataText, "should be chainable");
    });
}());
