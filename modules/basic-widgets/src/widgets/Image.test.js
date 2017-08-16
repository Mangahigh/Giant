(function () {
    "use strict";

    module("Image");

    test("Instantiation", function () {
        var image = $basicWidgets.Image.create();
        equal(image.tagName, 'img', "should set tagName to img");
    });

    test("Image URL setter", function () {
        expect(3);

        var image = $basicWidgets.Image.create();

        image.addMocks({
            addAttribute: function (attributeName, attributeValue) {
                equal(attributeName, 'src', "should set src attribute");
                equal(attributeValue, 'http://foo.com/img.jpg', "should set new URL as src");
            }
        });

        strictEqual(image.setImageUrl('http://foo.com/img.jpg'), image, "should be chainable");
    });

    test("Image URL getter", function () {
        var image = $basicWidgets.Image.create()
            .setImageUrl('http://foo.com/img.jpg');

        equal(image.getImageUrl(), 'http://foo.com/img.jpg',
            "should return value of 'src' attribute");
    });
}());
