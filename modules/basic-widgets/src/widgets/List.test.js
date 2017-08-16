(function () {
    "use strict";

    module("List");

    test("Instantiation", function () {
        var list = $basicWidgets.List.create();

        equal(list.tagName, 'ul', "should set tagName property to UL");
    });

    test("Item addition", function () {
        var list = $basicWidgets.List.create(),
            item = $widget.Widget.create();

        throws(function () {
            list.addItemWidget(item);
        }, "should throw exception on invalid tag name");

        item.setTagName('li');

        strictEqual(list.addItemWidget(item), list, "should be chainable");
        strictEqual(item.parent, list, "should add item to list as child");

        // should not throw exception
        $basicWidgets.List.create()
            .setTagName('div')
            .addItemWidget($widget.Widget.create());
    });

    test("Item removal", function () {
        var item = $widget.Widget.create().setTagName('li'),
            widget = $widget.Widget.create(),
            list = $basicWidgets.List.create()
                .addItemWidget(item);

        throws(function () {
            list.removeItemWidget(widget);
        }, "should throw exception on non-item widget");

        strictEqual(list.removeItemWidget(item), list, "should be chainable");
        strictEqual(list.getChild(item.childName), undefined, "should remove item from list");
    });
}());
