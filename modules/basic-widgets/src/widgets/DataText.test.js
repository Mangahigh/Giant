(function () {
    "use strict";

    module("DataText");

    test("Instantiation", function () {
        throws(function () {
            $basicWidgets.DataText.create();
        }, "should raise exception on missing argument");

        throws(function () {
            $basicWidgets.DataText.create('foo/bar'.toDocumentKey());
        }, "should raise exception on invalid argument");
    });
}());
