(function () {
    "use strict";

    module("DataSingleSelect");

    test("Instantiation", function () {
        throws(function () {
            $basicWidgets.DataSingleSelect.create();
        }, "should raise exception on missing argument");

        throws(function () {
            $basicWidgets.DataSingleSelect.create('foo/bar'.toDocumentKey());
        }, "should raise exception on invalid argument");
    });

    test("Selection change handler", function (assert) {
        expect(1);

        $entity.config.appendNode('document>field'.toPath(), {
            'single-select/options': {
                fieldType: 'collection'
            },
            'single-select/selected': {
                fieldType: 'string'
            }
        });

        var done = assert.async(),
            select = $basicWidgets.DataSingleSelect.create(
                'single-select/1/selected'.toFieldKey(),
                undefined,
                'single-select/1/options'.toFieldKey())
                .addToParent($basicWidgets.Application.create());

        $entity.Field.addMocks({
            setValue: function (value) {
                if (this.entityKey.equals('single-select/1/selected'.toFieldKey())) {
                    equal(value, 'hello', "should set value in selected field");
                }

                $entity.Field.removeMocks();
                select.removeFromParent();
                done();
            }
        });

        select.spawnEvent($basicWidgets.EVENT_SELECT_SELECTION_CHANGE)
            .setAfterValues(['hello'].toCollection())
            .triggerSync();
    });

    test("Selected field change handler", function () {
        expect(1);

        $entity.config.appendNode('document>field'.toPath(), {
            'single-select/options': {
                fieldType: 'collection'
            },
            'single-select/selected': {
                fieldType: 'string'
            }
        });

        var select = $basicWidgets.DataSingleSelect.create(
            'single-select/1/selected'.toFieldKey(),
            undefined,
            'single-select/1/options'.toFieldKey())
            .addToParent($basicWidgets.Application.create());

        select.addMocks({
            _syncInputValueToEntity: function () {
                ok(true, "should sync selected state to entity");
            }
        });

        'single-select/1/selected'.toField().setValue(1);

        select.removeFromParent();
    });
}());
