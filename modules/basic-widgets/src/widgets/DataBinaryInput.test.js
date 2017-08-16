(function () {
    "use strict";

    module("DataBinaryInput");

    test("Instantiation", function () {
        throws(function () {
            $basicWidgets.DataBinaryInput.create();
        }, "should raise exception on missing arguments");

        throws(function () {
            $basicWidgets.DataBinaryInput.create('foo', 'bar');
        }, "should raise exception on invalid arguments");

        var checkbox = $basicWidgets.DataBinaryInput.create(
            'checkbox',
            'input/1/value'.toFieldKey(),
            'input/1/name'.toFieldKey());

        ok(checkbox.valueKey.equals('input/1/value'.toFieldKey()),
            "should set valueKey property");
        ok(checkbox.nameKey.equals('input/1/name'.toFieldKey()),
            "should set nameKey property");
    });
}());
