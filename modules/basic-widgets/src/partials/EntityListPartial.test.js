(function () {
    "use strict";

    module("EntityListPartial", {
        setup: function () {
            $entity.config.appendNode('document>field'.toPath(), {
                'form/inputs': {fieldType: 'ordered-collection'}
            });
        }
    });

    var DataTextList = $basicWidgets.List.extend('DataTextList')
        .addTraitAndExtend($entity.EntityBound)
        .addTraitAndExtend($basicWidgets.EntityListPartial)
        .addMethods({
            init: function (fieldKey) {
                $basicWidgets.List.init.call(this);
                $entity.EntityBound.init.call(this);
                $basicWidgets.EntityListPartial.init.call(this, fieldKey);
            },

            afterAdd: function () {
                $basicWidgets.List.afterAdd.call(this);
                $basicWidgets.EntityListPartial.afterAdd.call(this);
            },

            afterRemove: function () {
                $basicWidgets.List.afterRemove.call(this);
                $basicWidgets.EntityListPartial.afterRemove.call(this);
            },

            spawnItemWidget: function (itemKey) {
                return $basicWidgets.DataText.create(itemKey)
                    .setTagName('li');
            },

            spawnItemName: function (itemKey) {
                return itemKey.itemId;
            }
        });

    test("Instantiation", function () {
        throws(function () {
            DataTextList.create();
        }, "should raise exception on missing arguments");

        throws(function () {
            DataTextList.create('foo');
        }, "should raise exception on invalid arguments");

        throws(function () {
            DataTextList.create('input/dataListTest/name'.toFieldKey());
        }, "should raise exception on invalid field type");

        var dataList = DataTextList.create('form/dataListTest/inputs'.toFieldKey());

        ok(dataList.itemIdToChildName.isA($data.Collection),
            "should set itemIdToChildName property");
    });

    test("Item widget updating", function () {
        var fieldKey = 'form/dataListTest/inputs'.toFieldKey(),
            dataList = DataTextList.create(fieldKey),
            removedChildNames = [],
            addedChildNames = [];

        fieldKey.toField()
            .setNode({
                'foo': true,
                'bar': true
            });

        $widget.Widget.addMocks({
            removeFromParent: function () {
                removedChildNames.push(this.childName);
                return this;
            }
        });

        dataList.addMocks({
            addItemWidget: function (itemWidget) {
                addedChildNames.push(itemWidget.childName);
                return this;
            }
        });

        dataList._updateItemWidgets();

        $widget.Widget.removeMocks();

        deepEqual(dataList.itemIdToChildName.items, {
            "foo": "foo",
            "bar": "bar"
        }, "should set itemIdToChildName property");

        deepEqual(addedChildNames, [
            "foo",
            "bar"
        ], "should add new item widgets");

        deepEqual(removedChildNames, [], "should remove old item widgets");
    });

    test("Item widget getter by item key", function () {
        var fieldKey = 'form/dataListTest/inputs'.toFieldKey(),
            dataList = DataTextList.create(fieldKey);

        fieldKey.toField()
            .setNode({
                'foo': true,
                'bar': true
            });

        dataList.afterAdd();

        equal(dataList.getItemWidgetByKey(fieldKey.getItemKey('baz')), undefined,
            "should return undefined for absent item ID");

        var itemKey = fieldKey.getItemKey('foo'),
            itemWidget = dataList.getItemWidgetByKey(itemKey);

        ok(itemWidget.isA($widget.Widget), "should return Widget instance");
        equal(itemWidget.childName, 'foo', "should return correct widget");

        dataList.afterRemove();
    });

    test("Collection change handler", function () {
        expect(1);

        var fieldKey = 'form/dataListTest/inputs'.toFieldKey(),
            dataList = DataTextList.create(fieldKey);

        fieldKey.toField()
            .setNode({
                'foo': true
            });

        dataList.afterAdd();

        dataList.addMocks({
            _updateItemWidgets: function () {
                ok(true, "should update item widgets");
            }
        });

        fieldKey.toField().getItem('bar').setValue(true);

        dataList.removeMocks();

        dataList.afterRemove();
    });
}());
