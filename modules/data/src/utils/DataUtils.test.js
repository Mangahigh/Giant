(function () {
    "use strict";

    module("DataUtils");

    test("Empty object tester", function () {
        ok($data.DataUtils.isEmptyObject({}), "should return true for empty object");
        ok(!$data.DataUtils.isEmptyObject({foo: "bar"}), "should return false for non-empty object");
    });

    test("Singular object tester", function () {
        ok($data.DataUtils.isSingularObject({foo: "bar"}), "should return true for singular object");
        ok(!$data.DataUtils.isSingularObject({}), "should return false for empty object");
        ok(!$data.DataUtils.isSingularObject({foo: "bar", hello: "world"}),
            "should return false for object with more than 1 properties");
    });

    test("Shallow copy", function () {
        var referenceObject = {},
            originalObject = {
                foo: referenceObject,
                bar: referenceObject
            },
            originalArray = [referenceObject, referenceObject],
            copyObject = $data.DataUtils.shallowCopy(originalObject),
            copyArray = $data.DataUtils.shallowCopy(originalArray);

        equal($data.DataUtils.shallowCopy(undefined), undefined, "should return undefined for undefined");
        equal($data.DataUtils.shallowCopy(5), 5, "should return original for primitive");
        notStrictEqual(copyArray, originalArray, "should return different array instance for array");
        deepEqual(copyArray, originalArray, "should return array with identical contents for array");
        notStrictEqual(copyObject, originalObject, "should return different object instance for object");
        deepEqual(copyObject, originalObject, "should return object with identical contents for object");
    });
}());