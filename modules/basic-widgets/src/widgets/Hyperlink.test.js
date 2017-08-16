(function () {
    "use strict";

    module("Hyperlink");

    test("Instantiation", function () {
        var hyperlink = $basicWidgets.Hyperlink.create();

        equal(hyperlink.tagName, 'a', "should set tagName property");
    });

    test("Target URL setter", function () {
        expect(3);

        var hyperlink = $basicWidgets.Hyperlink.create();

        hyperlink.addMocks({
            addAttribute: function (attributeName, attributeValue) {
                equal(attributeName, 'href', "should set href attribute");
                equal(attributeValue, 'http://foo.com', "should set target URL as href");
            }
        });

        strictEqual(hyperlink.setTargetUrl('http://foo.com'), hyperlink,
            "should be chainable");
    });

    test("Target URL getter", function () {
        var hyperlink = $basicWidgets.Hyperlink.create()
            .setTargetUrl('http://foo.com');

        equal(hyperlink.getTargetUrl(), hyperlink.htmlAttributes.getItem('href'),
            "should return 'href' attribute");
    });
}());
