(function () {
    "use strict";

    module("Application", {
        setup: function () {
            if ($widget.Widget.rootWidget) {
                $widget.Widget.rootWidget.removeRootWidget();
            }
            $basicWidgets.Application.clearInstanceRegistry();
        },

        teardown: function () {
            if ($widget.Widget.rootWidget) {
                $widget.Widget.rootWidget.removeRootWidget();
            }
            $basicWidgets.Application.clearInstanceRegistry();
        }
    });

    test("Instantiation", function () {
        expect(2);

        $widget.Widget.addMocks({
            setRootWidget: function () {
                ok(true, "should set Application widget as root");
            }
        });

        var application = $basicWidgets.Application.create();
        strictEqual($basicWidgets.Application.create(), application,
            "should be singleton");

        $widget.Widget.removeMocks();
    });

    test("Page addition handler", function () {
        var application = $basicWidgets.Application.create(),
            page = $basicWidgets.Page.create(),
            addedCssClasses = {};

        application.addMocks({
            addCssClass: function (cssClass) {
                addedCssClasses[cssClass] = true;
            }
        });

        application.spawnEvent($basicWidgets.EVENT_PAGE_ADD)
            .setSender(page)
            .triggerSync();

        application.removeMocks();

        deepEqual(addedCssClasses, {
            Page  : true,
            Widget: true
        }, "should add CSS classes from page to application");
    });

    test("Page removal handler", function () {
        var application = $basicWidgets.Application.create(),
            page = $basicWidgets.Page.create(),
            removedCssClasses = {};

        application.addMocks({
            onPageAdd: function () {
                // do nothing
            },

            decreaseCssClassRefCount: function (cssClass) {
                removedCssClasses[cssClass] = true;
            }
        });

        page.addToParent(application);

        application.spawnEvent($basicWidgets.EVENT_PAGE_REMOVE)
            .setSender(page)
            .triggerSync();

        application.removeMocks();

        deepEqual(removedCssClasses, {
            Page  : true,
            Widget: true
        }, "should decrease CSS class ref count from page on application");
    });
}());
