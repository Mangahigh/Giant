(function () {
    "use strict";

    module("EntitySelectPartial");

    var EntitySelectPartial = $widget.Widget.extend('EntitySelectPartial')
        .addTraitAndExtend($basicWidgets.EntitySelectPartial)
        .addMethods({
            init: function (selectedKey) {
                $widget.Widget.init.call(this);
                $basicWidgets.EntityTagged.init.call(this, selectedKey);
            },

            afterAdd: function () {
                $widget.Widget.afterRender.call(this);
                $basicWidgets.EntitySelectPartial.afterAdd.call(this);
            }
        });

    test("Item widget spawner", function () {
        var select = EntitySelectPartial.create('foo/1/bar'.toFieldKey()),
            itemWidget = select.spawnItemWidget('foo/1/baz/0'.toItemKey());

        ok(itemWidget.isA($basicWidgets.DataOption), "should return DataOption instance");
        equal(itemWidget.getValue(), '0', "should set Option value");
    });

    test("Item name spawner", function () {
        var select = EntitySelectPartial.create('foo/1/bar'.toFieldKey()),
            itemName = select.spawnItemName('foo/1/baz/0'.toItemKey());

        equal(itemName, '0', "should return item ID");
    });
}());
