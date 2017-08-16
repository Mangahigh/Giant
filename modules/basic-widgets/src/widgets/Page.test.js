(function () {
    "use strict";

    module("Page");

    test("Addition", function () {
        expect(2);

        var application = $basicWidgets.Application.create(),
            page = $basicWidgets.Page.create();

        application.subscribeTo($basicWidgets.EVENT_PAGE_ADD, function (event) {
            ok(true, "should trigger page.add event on application");
            strictEqual(event.sender, page, "should set page as sender");
        });

        page.addToParent(application);

        application.unsubscribeFrom($basicWidgets.EVENT_PAGE_ADD);
    });

    test("Removal", function () {
        expect(2);

        var application = $basicWidgets.Application.create(),
            page = $basicWidgets.Page.create()
                .addToParent(application);

        application.subscribeTo($basicWidgets.EVENT_PAGE_REMOVE, function (event) {
            ok(true, "should trigger page.remove event on application");
            strictEqual(event.sender, page, "should set page as sender");
        });

        page.removeFromParent();

        application.unsubscribeFrom($basicWidgets.EVENT_PAGE_REMOVE);
    });

    test("Active page setter", function () {
        expect(3);

        var page = $basicWidgets.Page.create(),
            application = $basicWidgets.Application.create();

        page.addMocks({
            addToParent: function (parent) {
                strictEqual(parent, application, "should add page to application");
            }
        });

        strictEqual(page.setAsActivePage(), page, "should be chainable");

        page.removeMocks();

        equal(page.childName, 'active-page', "should set page childName property");
    });
}());
